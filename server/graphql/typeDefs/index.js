const { gql } = require('apollo-server-express');
const Post = require('./Post');
const Map = require('./Map');

const root = gql`
  type Query {
    dummy: String
  }

  type Mutation {
    dummy: String
  }

  type Subscription {
    dummy: String
  }
`;

module.exports = [ root, Post, Map ];
