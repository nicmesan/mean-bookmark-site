
module.exports = function($scope, postsService, auth, userUpvotes, userDownvotes, $rootScope){
    'ngInject';

    $scope.posts = postsService.posts;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.showAlertNotLogged = false;
    $scope.postUpvotes = userUpvotes;
    $scope.postDownvotes = userDownvotes;
    $scope.showAlertSuccesful = false;

    $rootScope.$on('$locationChangeSuccess', function(e, toState, toParams, fromState, fromParams){
        $scope.showAlertSuccesful = true;
    });

    $scope.checkVotes = function (arr, val) {
        return arr.some(function(arrVal) {
            return val === arrVal;
        });
    };

    $scope.upVote = function(post){
        if($scope.isLoggedIn()){
            postsService.postUp(post);
        }
        else {
            $scope.showAlertNotLogged = true;
        }

    };

    $scope.downVote = function(post){
        if($scope.isLoggedIn()) {
            postsService.postDown(post);
        }
        else{
            $scope.showAlertNotLogged = true;
        }
    };

    $scope.addPost = function(){
        if (!$scope.titleToAdd){
            return;
        }
        postsService.addPost({title: $scope.titleToAdd, upvotes: 0, link: ($scope.link != "") ? 'http://' + $scope.link : ""});
        $scope.titleToAdd = '';
        $scope.link = '';
    };


};