const http = require('http');
const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({dev});
const nextHandler = nextApp.getRequestHandler()
const app = express();

//GraphQl
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/typeDefs/index');
const resolvers = require('./graphql/resolvers/index');


const server = new ApolloServer({
  typeDefs,
  resolvers,
  // username can be used in context, passed from middleware
  context: async ({ req, res, connection }) => {
    // for subscription context
    if (connection) {
      // check connection for metadata
      return {};
    } else {
      // for normal query and mutation contexts

      return {};
    }
  }
});

server.applyMiddleware({ app });

const httpServer = http.createServer(app);

server.installSubscriptionHandlers(httpServer);

// mongoDB
mongoose.Promise = Promise;
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
  }@cluster0-zzqu1.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
)
.then(() => {
  console.log('db connect');
})
.catch(err => {
  console.log(err);
});

nextApp.prepare().then(() => {

  app.get('*', (req, res) => {
    return nextHandler(req, res)
  });

// to change the endpoint to graphql, have to change the node_modules folder on Apollo Server
  httpServer.listen(port, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${port}${
        server.subscriptionsPath
      }`
    );
  });
});
