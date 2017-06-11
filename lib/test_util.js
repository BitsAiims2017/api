const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const User = require('../models/user.js');

/**
 * Add sample users
 */
exports.add_users = (done) => {
    // remove all users
    User.remove({}, (err) => {
        // add an admin and a viewer
        User.collection.insertMany([ 
            { 
                username: 'admin',
                password: { hash: 'db026a1dc117b7beff39938bae6b486bb92228724ac496e355a3751f1710bf54a4fe0b15e668d3e0eb8458b5f68580cbae68eacd56e1903c06e32eae2ebbe545',
                    salt: '060d7f1a132b6086' }, // password1
                name: 'Administrator',
                role: 'admin'
            },
            {
                username: 'username01',
                password: { hash: 'aad7fc92e974c4d60b49fcb6f773b68504f73a0094e89ed34b95f896ea8244c7899e3def85c0c79985c2d72a7a9536f3d1d2a92e5a7b15a7a3e3b972bfe6eabe',
                    salt: '65537ea6d692d7c3' }, //password2
                name: 'User 01',
                role: 'viewer'
            }
        ], {}, done);
    });

};

/**
 * Remove all users
 */
exports.remove_all_users = (done) => {
    User.remove({}, (err) => {
        should.not.exist(err); 
        done();
    });
};

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
};
