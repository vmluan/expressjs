var express = require('express');
var blogPost = require('../db/blog');
var router = express.Router();
var un = 'node';//change this to something private
var pw = 'password';//change this to something private
// for basic auth
var basicAuth = require('basic-auth');

var User        = require('../app/models/user');
var passport	  = require('passport');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config      = require('../config/database'); // get db config file


var auth = function (req, res, next) {
  function unauthorized(res) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };
  var user = basicAuth(req);
  if (!user || !user.name || !user.pass) {
    console.log(user);
    return unauthorized(res);
  }
  ;

  if (user.name === un && user.pass === pw) {
    return next();
  } else {
    console.log('---');
    return unauthorized(res);
  }
  ;
};

var checkToken = function(req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log('checking token');
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        var object = Object.getOwnPropertyNames(decoded);
        console.log(object);
        console.log(object[2]);
        var name = decoded._doc.name;
        var pass = decoded._doc.password;
        console.log(name);
        console.log(pass);
        // from name and password, we can check roles or whatever we want, If it ok, call next();
        if(true)
          next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
};

// end of basic auth
//login page
/* POST for login. */
router.post('/login', function(req, res, next) {
  console.log('call login page');
  /*var reqBody = req.body;
  var auth = false;
  if (!req.is('application/json')) {
    res.status(415);
  } else {
    if (reqBody.username === un && reqBody.password === pw) {
      auth = true;
    }
  }
  var returnVal = {
    "authenticated": auth
  };
  res.send(returnVal);*/

  // will have code for authentication here  //luan
  // find the user
  console.log('===== ' + req.body.username);
  User.findOne({
    name: req.body.username
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // if user is found and password is right
      // create a token
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.sign(user, config.secret, {
            expiresIn: 600 // number in seconds
          });
          res.json({
            authenticated: true,
            message: 'Enjoy your token!',
            token: token
          });
        } else {
          res.send({authenticated: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });

});

router.post('/authenticate', function(req, res) {
  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // if user is found and password is right
      // create a token
      user.comparePassword(req.body.password, function(err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.sign(user, config.secret, {
            expiresIn: 600 // number in seconds
          });
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        } else {
          res.send({success: false, msg: 'Authentication failed. Wrong password.'});
        }
      });
    }
  });
});

router.get('/blogList',checkToken, function(req, res, next){
  console.log('get blog list in routing file');
  blogPost.findBlogList2(req, res);
});

router.post('/blog',checkToken, function(req, res, next){
  console.log('connecting database to save new blog');
  var result = blogPost.saveBlog(req, res);
  res.send(result);
});

router.get('/blog/:id',checkToken, function(req, res, next){
  var result = blogPost.findBlog(req, res);
});
router.post('/comment',checkToken, function(req, res, next){
  var result = blogPost.saveComment(req, res);
});

// route middleware to verify a token
//router.use(checkToken);
module.exports = router;
