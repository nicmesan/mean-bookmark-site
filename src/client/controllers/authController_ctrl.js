
module.exports = function($scope, $state, auth ){
    'ngInject';
    $scope.user = {};

    $scope.register = function(){
        auth.register($scope.user).then(function(){
            $state.go('home');
        }, function(error){
            $scope.error = error.data;
        });
    };

    $scope.logIn = function(){
        auth.logIn($scope.user).then(function(){
            $state.go('home');
        }, function(error){
            $scope.error = error.data;
        });
    };
};
