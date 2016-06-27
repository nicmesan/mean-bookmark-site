
var app = require('angular').module('mainApp');

app.service('auth', require('./auth_service'));
app.service('postsService', require('./postsService_service'));

