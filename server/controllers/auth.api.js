const express = require('express'),
    router = express.Router(),
    jwt = require('jsonwebtoken'),
    User = require("../models/admin-user"),
    config = require('../config/config');

// route middleware to verify a token
router.use(function (req, res, next) {
    
        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {
    
            // verifies secret and checks exp
            jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });
    
        } else if(req.path === "/authenticate") {
            next();
        } else {
    
            // if there is no token
            // return an error
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
    
        }
    });

router.post('/authenticate', function (req, res) {
 
    // find the user
    User.findOne({
        username: req.body.username
    }, function (err, user) {

        if (err) throw err;
        if (!user) {
            res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {

            // check if password matches
            if (user.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            } else {
               
                // if user is found and password is right
                // create a token
                var token = jwt.sign({data:user}, config.JWT_SECRET, {
                    expiresIn: 86400 // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    loggedInUser: user 
                });
            }

        }

    });
});

module.exports = router;