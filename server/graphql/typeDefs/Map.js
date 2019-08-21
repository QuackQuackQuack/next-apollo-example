const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Map {
    _id: ID,
    title: String!
    address: String!
  }
  extend type Query {
    maps: [Map!]!
  }
  extend type Mutation {
    addMap(title: String!, address: String!): Map!
  }
  extend type Subscription {
    subscriptionMap: Map!
  }
`;

module.exports = typeDefs;
