const jwt = require('jsonwebtoken');
const config = require('../config/default.js');
const rate_limit = require('express-rate-limit');

exports.get_token = (data) => {
    const options = {expiresIn: '30d'};
    const token = jwt.sign(data, config.token.secret, options);
    return token;
};

exports.decode_token = (req, res, next) => {
    const token = req.body.token || req.params.token || req.query.token;
    if (token) {
        jwt.verify(token, config.token.secret, (err, data) => {
            if (err) {
                res.status(401).send({status: 401, message: 'Unauthorized'});
            } else {
                req.data = data;
                next();
            }
        });
    }
    else {
        req.data = {};
        next();
    }
};

exports.authenticate = (options) => {
    return (req, res, next) => {
        const role = options.role || 'admin';
        const roles = options.roles || [];
        const requested = req.data.role;
        let valid = false;

        /* admin can do anything */
        if (requested === 'admin') {
            valid = true;
        }

        /* allow if requested role is same as user role */
        if (requested === role) {
            valid = true;
        }

        /* allow if username is same as requested username */
        if (role === 'me' && req.params.username === req.data.username) {
            valid = true;
        }

        /* if a role is in possible roles */
        for (let x in roles) {
            if (requested === roles[x]) {
                valid = true;
                break;
            }
        }

        if (valid) {
            next();
        } else {
            res.status(401).send({status: 401, message: 'Not authorized'});
        }
    };
};

exports.limiter = new rate_limit({
    windowMs: 24*60*60*1000,  // a day
    max: (process.env.NODE_ENV === 'test') ? 100 : 20,
    delayMs: (process.env.NODE_ENV === 'test') ? 0 : 100,
    handler: (req, res) => {
        res.status(429).send({
            status: 429,
            message: 'Too many requests. Try again after sometime'
        });
    },
    onLimitReached: (req, res) => {
        console.log('Too many requests by IP: ' + req.ip);
    }
});
