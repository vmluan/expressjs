/**
 * Created by luan on 4/27/16.
 */
var express = require('express');
var config      = require('../config/database'); // get db config file
var User        = require('../app/models/user');
var apiRoutes = express.Router();
var passport	  = require('passport');
var jwt 			  = require('jwt-simple');

apiRoutes.post('/signup', function(req, res) {
    if (!req.body.name || !req.body.password) {
        res.json({succes: false, msg: 'Please pass name and password.'});
    } else {
        var newUser = new User({
            name: req.body.name,
            password: req.body.password
        });
        newUser.save(function(err) {
            if (err) {
                res.json({succes: false, msg: 'Username already exists.'});
            } else {
                res.json({succes: true, msg: 'Successful created user!'});
            }
        });
    }
});

apiRoutes.post('/authenticate', function(req, res) {
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch && !err) {
                    var token = jwt.encode(user, config.secret);
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

apiRoutes.get('/memberinfo', passport.authenticate('jwt', {session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
        User.findOne({
            name: decoded.name
        }, function(err, user) {
            if (err) throw err;

            if (!user) {
                return res.status(403).send({success: false, msg: 'Authentication failed. User not found.'});
            } else {
                return res.json({success: true, msg: 'Welcome in the member area ' + user.name + '!'});
            }
        });
    } else {
        return res.status(403).send({success: false, msg: 'No token provided.'});
    }
});

getToken = function(headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports = apiRoutes;

