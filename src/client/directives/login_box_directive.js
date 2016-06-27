module.exports = function(){
    return {
        template: '<div class="jumbotron" ng-hide="isLoggedIn()" ng-controller="navController">' +
        ' <h1>Want to participate?</h1> <p>Join our community NOW!</p> <p><a class="btn btn-primary btn-lg"' +
        ' href="/#/register" role="button">Register</a> <a class="btn btn-primary btn-lg" href="/#/login"' +
        ' role="button">Login</a></p> </div>'
    }
};