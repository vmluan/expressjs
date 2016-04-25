var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Hey', message: 'Hello there!'}); //it render index.html page.
  res.send('respond for /luans');
});

module.exports = router;
