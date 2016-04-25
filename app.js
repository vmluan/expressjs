var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var luans = require('./routes/luans');
var nodeBlog = require('./routes/blogs');
var testRoute = require('./routes/test');
var app = express();
 //luan - for mongodb information
var un = 'node';//change this to something private
var pw = 'password';//change this to something private


var blogPost = require('./db/blog');
 // luan - end of mongodb

// view engine setup
app.engine('html', require('ejs').renderFile);

app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//luan - for routing here
app.use('/', routes);
app.use('/users', users);
app.use('/luans', luans);
app.use('/NodeBlog',nodeBlog); // only requests to /NodeBlog/* will be sent to our "router"
//app.use('/NodeBlog', testRoute);

/*app.use('/NodeBlog/blogList', function(req, res, next) {
  blogPost.findBlogList(req,res);
  //next();
});*/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;


