import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost'
import { setContext } from "apollo-link-context";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import ws from "ws";


import fetch from 'isomorphic-unfetch'


const GRAPHQL_URL = 'http://localhost:3000/graphql'
const WS_URL = 'ws://localhost:3000/graphql'


let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

const httpLink = new HttpLink({
  uri: GRAPHQL_URL
});

const authLink = new setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  //const token = sessionStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      //authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const wsLink = process.browser
  ? new WebSocketLink(
      {
        uri: WS_URL,
        options: {
          reconnect: true
        }
      },
      ws
    )
  : null;

const link = process.browser
  ? split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      // wssLink,
      httpLink
    )
  : httpLink;


function create(initialState) {
  return new ApolloClient({
    // connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: authLink.concat(link),
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo (initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
