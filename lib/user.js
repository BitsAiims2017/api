// get 'User' model for users
const User = require('../models/user.js');

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
 * Get all users
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
