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

        if (req.data.role === 'admin' || req.data.role === role ||
            (role === 'me' && req.params.username === req.data.username)) {
            next();
        }
        else {
            res.status(401).send({status: 401, message: 'Not authorized'});
        }
    };
};

exports.limiter = new rate_limit({
    windowMs: 24*60*60*1000,  // a day
    max: (process.env.NODE_ENV === 'test') ? 100 : 100,
    delayMs: (process.env.NODE_ENV === 'test') ? 0 : 20,
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
