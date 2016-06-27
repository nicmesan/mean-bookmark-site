var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

const usersSchema = new Schema ({
    username: {type: String, lowercase: true, unique: true},
    hash: String,
    salt: String,
    upvotes: {type: Array, default: []},
    downvotes: {type: Array, default: []}
}, {collection: 'users'});

    usersSchema.methods.setPassword = function(password){
      this.salt = crypto.randomBytes(16).toString('hex');
      this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    };

    usersSchema.methods.validPassword = function(password){
        var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
        return this.hash === hash;
    };

    usersSchema.methods.generateJWT = function(){
        var expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);

        return jwt.sign({
            _id: this._id,
            username: this.username,
            exp: parseInt(expiry.getTime() / 1000)
        }, 'ADGJLQ')
    };

var users = mongoose.model('users', usersSchema);

module.exports = users;