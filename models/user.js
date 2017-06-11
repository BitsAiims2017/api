const crypto = require('crypto');
const db = require('../config/db.js');

const user_schema = new db.Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        hash: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        enum: ['admin', 'viewer'],
        required: true
    },
    meta: {
        joined: Date
    }
});

/**
* Generate salted hash for the password
*/
user_schema.methods.hash_password = (password) => {
    let length = 32;

    const salt = crypto.
        randomBytes(Math.ceil(length/2)).
        toString('hex').
        slice(0, length/2);

    const hashed = crypto.createHmac('sha512', salt);
    hashed.update(password);
    var hash = hashed.digest('hex');

    return {salt, hash};
};

module.exports = db.model('User', user_schema);
