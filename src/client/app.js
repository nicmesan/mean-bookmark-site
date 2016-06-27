
var angular = require('angular');
require('angular-ui-router');

var app = angular.module('mainApp', ['ui.router']);

require('./services');
require('./controllers');
require('./filters');
require('./directives');
require('./views/app.templates');



//CONFIGURATION

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('home', {
           url: '/home',
           templateUrl: 'home.html',
           controller: 'mainController',
           resolve: {  postPromise: ['postsService', function(postsService){
                return  postsService.getAll();
           }],
                       userUpvotes: ['auth', function(auth){
                          return auth.getUpvotes();
                       }],
                       userDownvotes: ['auth', function(auth){
                           return auth.getDownvotes();
                       }]
           }
        })
        .state('post', {
            url: '/post/{id}',
            templateUrl: 'post.html',
            controller: 'postController',
            resolve: {post: ['postsService', "$stateParams", function(postsService, $stateParams){
                return postsService.getPost($stateParams.id)
            }]}
        })
        .state('register',{
            url: '/register',
            templateUrl: 'register.html',
            controller: 'authController',
            onEnter: ['$state', 'auth', function($state, auth){
                if(auth.isLoggedIn()){
                    $state.go('home');
                }
            }]
        })
        .state('login',{
            url: '/login',
            templateUrl: 'login.html',
            controller: 'authController',
            onEnter: ['$state', 'auth', function($state, auth){
                if(auth.isLoggedIn()){
                    $state.go('home');
                }
            }]
        });

    $urlRouterProvider.otherwise('/home');
}]);

