const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const User = require('../models/user.js');

/**
 * Add sample users
 */
exports.add_users = (done) => {
    // remove all users
    User.remove({}, (err) => { should.not.exist(err); });

    // add an admin and a viewer
    User.collection.insertMany([ 
        { 
            username: 'admin',
            password: { hash: 'hash', salt: 'salt' },
            name: 'Administrator',
            role: 'admin'
        },
        {
            username: 'username01',
            password: { hash: 'hash', salt: 'salt' },
            name: 'User 01',
            role: 'viewer'
        }
    ], {}, done);
}

/**
 * Remove all users
 */
exports.remove_all_users = (done) => {
    User.remove({}, (err) => {
        should.not.exist(err); 
        done();
    });
}

/**
 * Test a route for bad request
 */
exports.check_bad_request = (err, res) => {

    should.exist(err);
    should.exist(res);
    err.should.have.status(400);
    res.should.have.status(400);
    should.exist(res.body);
    res.body.message.should.equal('Invalid request');
}
