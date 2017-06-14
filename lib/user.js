// get 'User' model for users
const User = require('../models/user.js');
const auth = require('../lib/auth.js');

exports.invalid_request = () => {
    return {
        status: 400,
        message: 'Invalid request'
    };
};

/**
 * Returns the user details with the given user ID
 *
 * @param username Username of the user
 * @param done Callback with error and data
 */
exports.get_user = (username, done) => {
    let data = {};

    User.findOne({username}, 'name username role', (err, user) => {
        if (err) {
            done({status: 500, message: 'Internal error 001'}, null);
        }
        else if (user) {
            data.name = user.name;
            data.username = user.username;
            data.role = user.role;

            done(null, data);
        }
        else {
            done({status: 404, message: 'User not found'}, null);
        }
    });
};

/**
 * Create a new user with the given user details
 *
 * @param data Object with user details
 * @param done Callback with response
 */
exports.new_user = (data, done) => {
    let error = {};

    User.findOne({username: data.username}, (err, person) => {
        if (err) {
            done({status: 500, message: 'Internal error 004'});
        }
        else if(person) {
            done({status: 409, message: 'User already exists'});
        }
        else {
            let new_user = new User();

            new_user.name = data.name;
            new_user.username = data.username;
            new_user.role = data.role;
            new_user.password = new_user.hash_password(data.password);

            new_user.save((save_err) => {
                if (save_err) {
                    return (save_err) => {
                        done({status: 500, message: 'Internal error 002'});
                    };
                }
                else {
                    done({ status: 201, message: 'User created'});
                }
            });
        }
    });
};

/**
 * Delete a user with the given username
 *
 * @param username The username of user to be deleted
 * @param done Callback with response
 */
exports.delete_user = (username, done) => {
    User.find({username}).remove((err) => {
        if (err) {
            done({status: 500, message: 'Internal error 003'});
        } else {
            done({status: 202, message: 'User deleted'});
        }
    });
};

/**
 * Update details for a use
 *
 * @param username The username of the user
 * @param data An object with fields to be updated
 * @param done A callback with err and response
 */
exports.update_user = (username, data, done) => {
    User.findOne({username}, (err, user) => {
        if (err || !user) {
            done({status: 404, message: 'User not found'}, null);
        } else {
            for (var prop in data) {
                if (user[prop]) { user[prop] = data[prop]; }
            }
            user.save((err) => {
                if (err) {
                    done({status: 500, message: 'Internal error 012'}, null);
                } else {
                    done(null, {status: 200, message: 'User updated'});
                }
            });
        }
    });
};

/**
 * Get all users
 *
 * @param done Callback with err and data
 */
exports.get_all_users = (done) => {
    User.find({}, 'name username role', (err, user) => {
        if (err) {
            done({status: 500, message: 'Internal error 005'}, null);
        } else {
            done(null, user);
        }
    });
};

/**
 * Check username and password combination is valid and
 * return user details
 *
 * @param user Object with username and password
 * @return done Callback with err and user details
 */
exports.auth_user = (user, done) => {
    User.findOne({username: user.username}, (err, data) => {
        if (err) {
            done({status: 500, message: 'Internal error 006'}, null);
        } else if (data) {
            if (data.verify_password(user.password)) {
                done(null, {
                    token: auth.get_token({
                        role: data.role,
                        username: data.username
                    }) });
            } else {
                done({status: 401, message: 'Wrong credentials'}, null);
            }
        } else {
            done({status: 404, message: 'User not found'}, null);
        }
    });
};
