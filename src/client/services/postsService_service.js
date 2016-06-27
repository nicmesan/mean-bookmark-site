
module.exports = function($http, auth){
    'ngInject';
    
    this.posts = [];
    var self = this;

    this.getAll = function(){
        return $http.get('/posts').then(function(data){
            angular.copy(data.data, self.posts);
        });

    };

    this.getPost = function(id){
        return $http.get('/post/' + id).then(function(res){
            return res.data;
        })
    };

    this.addPost = function(post){
        return $http.post('/posts', post, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).then(function(res){self.posts.push(res.data);})
    };

    this.postUp = function(post) {
        return $http.put('/post/' + post._id + '/upvote', null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).then(function (data) {
            if (!data.data.message) {

                post.upvotes += 1;
            }
        });
    };

    this.postDown = function(post) {
        return $http.put('/post/' + post._id + '/downvote', null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).then(function () {
            post.upvotes -= 1;
        });
    };

    this.commentUp = function(post, comment){
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).then(function(){
            comment.upvotes += 1;
        });
    };

    this.commentDown = function(post, comment){
        return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote', null, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        }).then(function(){
            comment.upvotes -= 1;
        });
    };

    this.addComment = function(post, comment){
        return $http.post('/post/' + post._id + '/comments', comment, {
            headers: {Authorization: 'Bearer ' + auth.getToken()}
        });
    }
};
