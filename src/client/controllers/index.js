'use strict';

var app = require('angular').module('mainApp');

app.controller('authController', require('./authController_ctrl'));
app.controller('mainController', require('./mainController_ctrl'));
app.controller('navController', require('./navController_ctrl'));
app.controller('postController', require('./postController_ctrl'));