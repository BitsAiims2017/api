
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
 * @param id ID of the user
 * @param done Callback with error and data
 */
exports.get_user = (id, done) => {
    let error = {};
    let data = {};

    User.findOne({id: id}, 'name username role', (err, user) => {
        if (err) {
            error.status = 400;
            error.message = 'Internal error 001';

            done(err, null);
        }
        else if (user) {
            data.name = user.name;
            data.username = user.username;
            data.role = user.role;

            done(null, data);
        }
        else {
            error.status = 404;
            error.message = 'User not found';

            done(error, null);
        };
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
        if (err || person) {
            done({status: 409, message: 'User already exists'});
        }
        else {
            let new_user = new User();

            new_user.name = data.name;
            new_user.username = data.username;
            new_user.role = data.role;
            new_user.password = new_user.hash_password(data.password);
            new_user.user_id = new_user.get_new_user_id();

            new_user.save((save_err) => {
                if (save_err) {
                    return done({status: 500, message: 'Internal error 002'});
                }
                else {
                    done({ status: 201, message: 'User created'});
                };
            });
        };
    });
};
