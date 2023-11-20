const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {type:String, required:true},
  description: {type:String, required:true},
  date: { type: Date },
  creator: { type: mongoose.Types.ObjectId, required:true ,ref: 'User' },
  creatorId:{ type: mongoose.Types.ObjectId, required:true ,ref: 'User' }
});

module.exports = mongoose.model('Post',postSchema)