const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  address: String
});

module.exports = mongoose.model('Map', postSchema);
