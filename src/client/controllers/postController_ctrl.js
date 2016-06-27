
module.exports = function($scope, $stateParams, postsService, post, auth){
    'ngInject';

    $scope.post = post;
    $scope.userName = auth.currentUser();
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.showAlert = false;

    $scope.upvoteComment = function(e, comment, i){
        if($scope.isLoggedIn()) {
            postsService.commentUp(post, comment);
            e.target.style.color = 'green';
            document.getElementsByClassName("downvoteIcon")[i].style.color = "black";
        }
        else {
            $scope.showAlert = true;
        }
    };

    $scope.downvoteComment = function(e, comment, i){
        if($scope.isLoggedIn()) {
            postsService.commentDown(post, comment);
            e.target.style.color = 'red';
            document.getElementsByClassName("upvoteIcon")[i].style.color = "black";
        }
        else {
            $scope.showAlert = true;
        }
    };

    $scope.addComment = function(){
        if (!$scope.userComment || !$scope.userName ){
            return;
        }
        postsService.addComment(post, {body: $scope.userComment, upvotes: 0, author: $scope.userName}).success(function(comment){
            $scope.post.comments.push(comment);
        });

        $scope.userComment = '';
    }
};
