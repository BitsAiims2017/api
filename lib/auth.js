const jwt = require('jsonwebtoken');

exports.get_token = (options) => {
    let token;

    // create a token here
    token = 'a token here';

    return token;
};

exports.decode_token = (req, res, next) => {
    next();
};

exports.authenticate = (options) => {
    return (req, res, next) => {
        next();
    };
};
