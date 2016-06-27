var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const commentSchema = new Schema ({
    body: String,
    author: String,
    upvotes: {type: Number, default: 0},
    post: [{type: mongoose.Schema.Types.ObjectId, ref: 'posts'}]
}, {collection: 'comments'});

commentSchema.methods.upvote = function(cb){
    this.upvotes += 1;
    this.save(cb);
};

commentSchema.methods.downvote = function(cb){
        this.upvotes -= 1;
        this.save(cb);
};

var comments = mongoose.model('comments', commentSchema);

module.exports = comments;