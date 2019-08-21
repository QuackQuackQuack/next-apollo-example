const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Post {
    _id: ID,
    author: String!
    comment: String!
  }
  extend type Query {
    posts: [Post!]!
    post(author: String!): [Post!]!
  }
  extend type Mutation {
    addPost(author: String!, comment: String!): Post!
    deletePost(_id: String!): Post!
    updatePost(_id: String!, author: String!, comment: String!): Post!
  }
  extend type Subscription {
    postAdded: Post!
    postDeleted: Post!,
    postEdit: Post!
  }
`;

module.exports = typeDefs;
