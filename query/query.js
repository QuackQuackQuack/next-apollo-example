import gql from 'graphql-tag'



const GET_POSTS = gql`
  query {
    posts {
      author
      comment
      _id
    }
  }
`;


const ADD_POST = gql`
  mutation addPost($author: String!, $comment: String!) {
    addPost(author: $author, comment: $comment) {
      author
      comment
    }
  }
`;

const DELETE_POST = gql`
  mutation deletePost($_id: String!) {
    deletePost(_id: $_id) {
      _id
    }
  }
`;


const POST_CREATED = gql`
  subscription {
    postAdded {
      _id
      author
      comment
    }
  }
`;

const POST_EDIT = gql`
  subscription {
    postEdit {
      _id
      author
      comment
    }
  }
`;


const POST_DELETE = gql`
  subscription {
    postDeleted {
      _id
      author
      comment
    }
  }
`;


const GET_MAPS = gql`
  query {
    maps {
      title
      address
    }
  }
`;

const MAP_ADDED = gql`
  subscription {
    subscriptionMap {
      title
      address
    }
  }
`;

const ADD_MAP = gql`
  mutation addMap($title: String!, $address: String!) {
    addMap(title: $title, address: $address) {
      title
      address
    }
  }
`;


module.exports = {
  GET_POSTS,
  ADD_POST,
  DELETE_POST,
  POST_CREATED,
  POST_EDIT,
  POST_DELETE,
  GET_MAPS,
  MAP_ADDED,
  ADD_MAP
};
