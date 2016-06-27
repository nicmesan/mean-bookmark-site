
module.exports = function(auth, $scope){
    'ngInject';
    $scope.logOut = auth.logOut;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;

};
