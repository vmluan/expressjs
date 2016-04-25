var express = require('express');
var blogPost = require('../db/blog');
var router = express.Router();
//login page
/* POST for login. */
router.post('/login', function(req, res, next) {
  console.log('call login page');
  res.json({ authenticated: true }); //always return true for testing purpose.
  // will have code for authentication here  //luan
});

router.get('/blogList', function(req, res, next){
  console.log('connecting database to get blog list');
  var result  = blogPost.saveBlog(req, res);
  //res.send(result);
});
module.exports = router;

