var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const postSchema = new Schema ({
    title: String,
    link: String,
    author: String,
    upvotes: {type: Number, default: 0},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'comments'}]
}, {collection: 'posts'});

postSchema.methods.upvote = function(cb){
    this.upvotes += 1;
    this.save(cb);
};

postSchema.methods.downvote = function(cb){
        this.upvotes -= 1;
        this.save(cb);
};

var posts = mongoose.model('posts', postSchema);

module.exports = posts;