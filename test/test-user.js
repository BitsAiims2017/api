process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const config = require('../config.js');
const app = require('../server.js');
const User = require('../models/user.js');

chai.use(chaiHttp);

/* *** Utility functions *** */
function add_users(done) {
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
    ],{}, done);
}

function remove_all_users(done) {
    User.remove({}, (err) => {
        should.not.exist(err); 
        done();
    });
}

function check_bad_request(err, res) {

    should.exist(err);
    should.exist(res);
    err.should.have.status(400);
    res.should.have.status(400);
    should.exist(res.body);
    res.body.message.should.equal('Invalid request');
}

/* *** Tests *** */
describe('/user', () => {

    beforeEach(add_users);
    after(remove_all_users);

    it('should return 401 on GET by non admin');
    it('should return 200 and all users on GET by admin', (done) => {
        chai.
            request(app).
            get('/user').
            end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                res.body.should.be.an('Array');
                res.body.length.should.equal(2);
                done();
            });
    });
    it('should return 401 on POST by non admin');
    it('should return 201 on POST by admin', (done) => {
        chai.
            request(app).
            post('/user').
            send({
                name: 'User2',
                username: 'username02',
                password: 'password1',
                role: 'viewer'
            }).
            then((res) => {
                should.exist(res);
                res.should.have.status(201);
                res.body.message.should.be.equal('User created');
                User.find({}, (e, p) => { p.length.should.equal(3); });
                done();
            });
    });
    it('should return 409 on POST with same username twice', (done) => {
        chai.
            request(app).
            post('/user').
            send({
                username: 'admin',
                name: 'Any other name',
                password: 'a password',
                role: 'viewer'
            }).
            end((err, res) => {
                should.exist(err);
                should.exist(res);
                res.should.have.status(409);
                res.body.message.should.equal('User already exists');
                done();
            });
    });
    it('should return 400 on PUT', () => {
        chai.
            request(app).
            put('/user').
            end(check_bad_request);
    });
    it('should return 400 on DELETE', () => {
        chai.
            request(app).
            delete('/user').
            end(check_bad_request);
    });
});

describe('/user/:id', () => {

    beforeEach(add_users);
    after(remove_all_users);

    it('should return 200 and user details on GET by admin', (done) => {
        chai.
            request(app).
            get('/user/username01').
            end((err, res) => {
                should.not.exist(err);
                should.exist(res);
                res.should.have.status(200);
                res.body.should.be.an('Object');
                res.body.name.should.equal('User 01');
                res.body.username.should.equal('username01');
                res.body.role.should.equal('viewer');
                done();
            });
    });
    it('should return 200 and user details on GET by user of ID = id');
    it('should return 404 for user not found on GET', (done) => {
        chai.
            request(app).
            get('/user/nonexist').
            end((err, res) => {
                should.exist(err);
                should.exist(res);
                err.should.have.status(404);
                res.body.message.should.equal('User not found');
                done();
            });
    });
    it('should return 400 on POST', () => {
        chai.
            request(app).
            post('/user/username').
            end(check_bad_request);
    });
    it('should return 202 on PUT by user of ID = id');
    it('should return 202 on PUT by admin');
    it('should return 403 on PUT by any other user');
    it('should return 202 on DELETE by admin', (done) => {
        chai.
            request(app).
            delete('/user/username02').
            then((res) => {
                should.exist(res);
                res.should.have.status(202);
                res.body.message.should.be.equal('User deleted');
                done();
            });
    });
    it('should return 403 on DELETE by any other user');
});
