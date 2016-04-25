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
    return res.send(401);
  };
  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  }
  ;

  if (user.name === un && user.pass === pw) {
    return next();
  } else {
    return unauthorized(res);
  }
  ;
};

// end of basic auth
//login page
/* POST for login. */
router.post('/login', function(req, res, next) {
  console.log('call login page');
  res.json({ authenticated: true }); //always return true for testing purpose.
  // will have code for authentication here  //luan
});

router.get('/blogList', function(req, res){
  console.log('get blog list in routing file');
  blogPost.findBlogList2(req,res);
 // res.send(result);
});

router.post('/blog', auth, function(req, res, next){
  console.log('connecting database to save new blog');
  var result = blogPost.saveBlog(req, res);
  res.send(result);
});
//self.app.post('/NodeBlog/blog', auth, blogPost.saveBlog);
module.exports = router;
