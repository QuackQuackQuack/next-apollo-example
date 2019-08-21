const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  author: String,
  comment: String
});

module.exports = mongoose.model('Post', postSchema);
