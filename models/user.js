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
*
* @param password The password to hash
* @return password Object with salt and hash
*/
user_schema.methods.hash_password = function hash_password (password) {
    let length = 32;

    const salt = crypto.
        randomBytes(Math.ceil(length/2)).
        toString('hex').
        slice(0, length/2);

    const hash = this.get_hash(password, salt);

    return {salt, hash};
};

/**
 * Generate salted hash for the password with the given salt
 *
 * @param password The password to hash
 * @param salt The salt to hash it with
 * @return hash Hashed password with the given salt
 */
user_schema.methods.get_hash = function get_hash (password, salt) {
    const hashed = crypto.createHmac('sha512', salt);
    hashed.update(password);
    var hash = hashed.digest('hex');

    return hash;
};

/**
 * Verify if the password is correct for the user
 *
 * @param password The password to verify with
 * @return bool If the password was correct
 */
user_schema.methods.verify_password = function verify_password (password) {
    const hash = user_schema.methods.get_hash(password, this.password.salt);
    if (hash === this.password.hash) {
        return true;
    } else {
        return false;
    }
};

module.exports = db.model('User', user_schema);
