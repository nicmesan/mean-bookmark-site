
module.exports = function($http, $window, $state, $stateParams){
    'ngInject';

    var self = this;


    this.saveToken = function (token){
        $window.localStorage['reddit-session-token'] = token;
    };

    this.getToken = function(){
        return $window.localStorage['reddit-session-token'];
    };

    this.isLoggedIn = function(){
        var token =  $window.localStorage['reddit-session-token'];
        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        }
        else{
            return false;
        }
    };

    this.currentUser = function(){
        var self = this;
        if(self.isLoggedIn()){
            var token = $window.localStorage['reddit-session-token'];
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return payload.username;
        }
    };

    this.register = function(user){
        var self = this;
        return $http.post('/register', user).then(function(res){
            self.saveToken(res.data.token);
        })
    };

    this.getUpvotes = function(){
        var upvotes = [];
        if(self.isLoggedIn()){
            var token = $window.localStorage['reddit-session-token'];
            var currentUser = JSON.parse($window.atob(token.split('.')[1]))._id;

            return $http.get('/' + currentUser + '/upvotes').then(function(res){
                return res.data;

            });
        }
        else {
            return upvotes;
        }
    };

    this.getDownvotes = function(){
        var downvotes = [];
        if(self.isLoggedIn()){
            var token = $window.localStorage['reddit-session-token'];
            var currentUser = JSON.parse($window.atob(token.split('.')[1]))._id;

            return $http.get('/' + currentUser + '/downvotes').then(function(res){
                return res.data;

            });
        }
        else {
            return downvotes;
        }
    };

    this.logIn = function(user){
        var self = this;
        return $http.post('login', user).then(function(res){
            self.saveToken(res.data.token);
        });
    };

    this.logOut = function(){
        $window.localStorage.removeItem('reddit-session-token');
        $state.transitionTo($state.current, $stateParams, {
            reload: true,
            inherit: false,
            notify: true
        });
    }

};