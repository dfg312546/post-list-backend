const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {type:String, required:true},
  description: {type:String, required:true},
  date: { type: Date },
  creator: {type:String, required:true},
  creatorId:{ type: mongoose.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Post',postSchema)