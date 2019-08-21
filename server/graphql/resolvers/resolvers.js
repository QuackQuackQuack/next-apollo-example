const { PubSub } = require('apollo-server-express');
const Post = require('../../models/post');
const Map = require('../../models/map');
const pubsub = new PubSub();
const POST_ADDED = 'POST_ADDED';
const POST_DELETE = 'POST_DELETE';
const POST_EDIT = 'POST_EDIT';
const MAP_ADDED = 'MAP_ADDED';

const postController = {
  posts: () => Post.find({}),
  post: (author) => Post.find({ author }),
  addPost: (post) => {
    const newPost = new Post({author: post.author, comment: post.comment});
    pubsub.publish(POST_ADDED, { postAdded: newPost });
    return newPost.save()
  },
  updatePost: async (args) => {
    const post = await Post.findOneAndUpdate({ _id: args._id }, { $set: { author: args.author, comment: args.comment } }, { new: true });
    pubsub.publish(POST_EDIT, { postEdit: post });
    return post;
  },
  deletePost: async (_id) => {

    const data = await Post.findByIdAndRemove(_id);
    pubsub.publish(POST_DELETE, { postDeleted: data });
    return data;
  },
};

const mapController = {
  maps: () => Map.find({}),
  addMap: (map) => {
    const newMap = new Map({title: map.title, address: map.address});
    pubsub.publish(MAP_ADDED, { subscriptionMap: newMap });
    return newMap.save()
  },
}


module.exports = {
  Query: {
    maps(root, args) {
      return mapController.maps();
    },
    posts(root, args) {
      return postController.posts();
    },
    post: (root, { author }) => {
      return postController.post(author);
    },
  },
  Mutation: {

    addMap(root, args) {
      return mapController.addMap(args);
    },
    addPost(root, args) {
      return postController.addPost(args);
    },
    updatePost(root, args) {
      return postController.updatePost(args);
    },
    deletePost(root, { _id }) {
      return postController.deletePost(_id);
    },
  },
  Subscription: {
    postAdded: {
      subscribe: () => pubsub.asyncIterator([POST_ADDED])
    },
    postDeleted: {
      subscribe: () => pubsub.asyncIterator([POST_DELETE])
    },
    postEdit: {
      subscribe: () => pubsub.asyncIterator([POST_EDIT])
    },
    subscriptionMap: {
      subscribe: () => pubsub.asyncIterator([MAP_ADDED])
    }
  },
};
