var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Posts = require('./models/posts');
var Comments = require('./models/comments');
var Users = require('./models/users');
var passport = require('passport');
var jwt = require('express-jwt');
require('./config/passport');

mongoose.connect('mongodb://localhost:27017/reddit');
var server = http.createServer(app);
server.listen(8080);
console.log('connected');

var auth = jwt({secret: 'ADGJLQ', userProperty: 'payload'});
var checkVotes = function (arr, val) {
    return arr.some(function(arrVal) {
        return val === arrVal;
    });
};


app.use(bodyParser.json({type: '*/*'}));
app.use(express.static(__dirname + '/../../public'));
app.use(passport.initialize());

//posts GET METHOD

app.get('/posts', function(req, res){
   Posts.find(function(err, posts){
      if (err){ return err;}

       res.json(posts);
       
   });
    
});

//posts POST METHOD

app.post('/posts', auth, function(req, res){
   var post = new Posts(req.body);
   post.author = req.payload.username;
    post.save(function(err, posts){
        if (err){ return err;}

        res.json(posts);

    });

});

//post/:id GET METHOD

app.get('/post/:id', function(req, res){
   var id = req.params.id;
    Posts.findById(id)
        .populate('comments')
        .exec(function(err, post){
        if (err){ return err;}

        res.json(post);
    })

});

// post UPVOTE PUT METHOD

app.put('/post/:id/upvote', auth, function(req, res, next){
    var id = req.params.id;
    var user = req.payload._id;

    Users.findById(user, function(err, user){
        if(checkVotes(user.upvotes, id)){
            res.send({message: "Post already upvoted"});
        }
        else {
            user.upvotes.push(id);
            user.save(function (err) {
                if (err) {
                    return err;
                }
            });
            Posts.findById(id, function(err, post){
                post.upvote(function(err, data){
                    if (err){ return err;}
                    res.json(data)
                });
            });
        }
    });

});

// post DOWNVOTE PUT METHOD

app.put('/post/:id/downvote',auth, function(req, res){
    var id = req.params.id;
    var user = req.payload._id;

    Users.findById(user, function(err, user){
        if(checkVotes(user.downvotes, id)){
            res.send({message: "Post already upvoted"});
        }
        else {
            user.downvotes.push(id);
            user.save(function (err) {
                if (err) {
                    return err;
                }
            });
            Posts.findById(id, function(err, post){
                post.downvote(function(err, data){
                    if (err){ return err;}
                    res.json(data)
                });
            });
        }
    });
    });



// post COMMENT FOR PARTICULAR POST

app.post('/post/:id/comments', auth, function(req, res){
    var comment = new Comments(req.body);
    var id = req.params.id;
    comment.post = id;
    comment.author = req.payload.username;
    comment.save(function(err, data){
       if (err){ return err;}

        Posts.findById(id,function(err, doc){
            if (err){ return err;}
            doc.comments.push(data["_id"]);
            doc.save(function(err, post){
                if (err){ return err;}
                res.json(comment);
            });
        })
    });
});

// put COMMENT UPVOTE

app.put('/posts/:post/comments/:comment/upvote', auth, function(req, res){
    var id = req.params.comment;
    Comments.findById(id, function(err, doc){
        if (err){ return err;}
        doc.upvote(function(err, data){
            if (err){ return err;}

            res.json(data);
        });
    });


});

// put COMMENT DOWNVOTE

app.put('/posts/:post/comments/:comment/downvote', auth, function(req, res){
    var id = req.params.comment;
    Comments.findById(id, function(err, doc){
        if (err){ return err;}
        doc.downvote(function(err, data){
            if (err){ return err;}
            res.json(data);
        });
            });
});

// get AUTHOR UPVOTES

app.get('/:author/upvotes', function(req, res){
    var user = req.params.author;
    Users.findById(user, function(err, data){
        if (err){ return err;}
        res.send(data.upvotes);

    })
});

// get AUTHOR DOWNVOTES

app.get('/:author/downvotes', function(req, res){
    var user = req.params.author;
    Users.findById(user, function(err, data){
        if (err){ return err;}
        res.send(data.downvotes);

    })
});


// REGISTRATION

app.post('/register', function(req, res){
   if (!req.body.username || !req.body.password){
       return res.status(400).json({message: 'Please fill out all the fields'})
   }

    Users.find({'username': req.body.username}, function(err, docs){
        if (docs.length){
            return res.status(400).json({message: 'Seems like that username is already taken. Please choose another one!'});
        }
        else {
            var user = new Users();
            user.username = req.body.username;

            user.setPassword(req.body.password);

            user.save(function(err){
                if (err){ return err;}

                return res.json({token: user.generateJWT()})
            });
        }
    });

   var user = new Users();
   user.username = req.body.username;

   user.setPassword(req.body.password);

   user.save(function(err){
       if (err){ return err;}

       return res.json({token: user.generateJWT()})
   });


});

// LOGIN

app.post('/login', function(req, res, next){
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    passport.authenticate('local', function(err, user, info){
        if(err){ return next(err); }

        if(user){
            return res.json({token: user.generateJWT()});
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});









