var express = require('express');
var blogPost = require('../db/blog');
var router = express.Router();
var un = 'node';//change this to something private
var pw = 'password';//change this to something private
// for basic auth
var basicAuth = require('basic-auth');

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

// end of basic auth
//login page
/* POST for login. */
router.post('/login', function(req, res, next) {
  console.log('call login page');
  var reqBody = req.body;
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
  res.send(returnVal);
  // will have code for authentication here  //luan
});

router.get('/blogList',auth, function(req, res, next){
  console.log('get blog list in routing file');
  blogPost.findBlogList2(req, res);
});

router.post('/blog', auth, function(req, res, next){
  console.log('connecting database to save new blog');
  var result = blogPost.saveBlog(req, res);
  res.send(result);
});

router.get('/blog/:id', function(req, res, next){
  var result = blogPost.findBlog(req, res);
});
router.post('/comment',auth, function(req, res, next){
  var result = blogPost.saveComment(req, res);
});
//self.app.post('/NodeBlog/comment', auth, blogPost.saveComment);
//self.app.get('/NodeBlog/blog/:id', blogPost.findBlog);
//self.app.post('/NodeBlog/blog', auth, blogPost.saveBlog);
module.exports = router;
