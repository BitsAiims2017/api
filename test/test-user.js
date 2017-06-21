process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const config = require('../config/default.js');
const app = require('../server.js');
const User = require('../models/user.js');
const util = require('../lib/test_util.js');
chai.use(chaiHttp);

describe('/users', () => {

    beforeEach(util.add_users);
    after(util.remove_all_users);

    it('should return 401 on GET by non admin', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/users').
                send({token}).
                end((err, res) => {
                    should.exist(err);
                    res.should.have.status(401);
                    res.body.message.should.equal('Not authorized');
                    done();
                });
        });
    });
    it('should return 200 and all users on GET by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                get('/users').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    res.should.have.status(200);
                    res.body.should.be.an('Array');
                    res.body.length.should.equal(2);
                    done();
                });
        });
    });

    it('should return 401 on POST by non admin', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                post('/users').
                send({
                    username: 'a_user',
                    name: 'Any other name',
                    password: 'a password',
                    role: 'viewer',
                    token
                }).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    res.should.have.status(401);
                    res.body.message.should.equal('Not authorized');
                    done();
                });
        });
    });
    it('should return 400 on POST if space in username', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/users').
                send({
                    name: 'User2',
                    username: 'username 02',
                    password: 'password2',
                    role: 'viewer',
                    token
                }).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    res.should.have.status(400);
                    done();
                });
        });
    });
    it('should return 400 on POST if incomplete parameters', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/users').
                send({
                    name: 'User2',
                    username: 'username02',
                    role: 'viewer',
                    token
                }).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    res.should.have.status(400);
                    res.body.message.should.be.equal('Incomplete parameters');
                    User.find({}, (e, p) => { p.length.should.equal(2); });
                    done();
                });
        });
    });
    it('should return 201 on POST by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/users').
                send({
                    name: 'User2',
                    username: 'username02',
                    password: 'password2',
                    role: 'viewer',
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(201);
                    res.body.message.should.be.equal('User created');
                    User.find({}, (e, p) => { p.length.should.equal(3); });
                    done();
                });
        });
    });
    it('should return 409 on POST with same username twice', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/users').
                send({
                    username: 'admin',
                    name: 'Any other name',
                    password: 'a password',
                    role: 'viewer',
                    token
                }).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    res.should.have.status(409);
                    res.body.message.should.equal('User already exists');
                    done();
                });
        });
    });

    it('should return 400 on PUT', () => {
        chai.
            request(app).
            put('/users').
            end(util.check_bad_request);
    });

    it('should return 400 on DELETE', () => {
        chai.
            request(app).
            delete('/users').
            end(util.check_bad_request);
    });
});

describe('/user/:id', () => {

    beforeEach(util.add_users);
    afterEach(util.remove_all_users);

    it('should return 200 and user details on GET by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                get('/users/username01').
                send({token}).
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
    });
    it('should return 200 and own user details on GET by user', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/users/username01').
                send({token}).
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
    });
    it('should return 404 for user not found on GET', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                get('/users/nonexist').
                send({token}).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    err.should.have.status(404);
                    res.body.message.should.equal('User not found');
                    done();
                });
        });
    });

    it('should return 400 on POST', () => {
        chai.
            request(app).
            post('/users/username').
            end(util.check_bad_request);
    });

    it('should return 200 on PUT by user of ID = id', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                put('/users/username01').
                send({ name: 'A new name', token}).
                end((err, res) => {
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.be.equal('User updated');
                    User.findOne({username: 'username01', name: 'A new name'},
                        (e, u) => {
                            should.exist(u);
                            done();
                        });
                });
        });
    });
    it('should return 202 on PUT by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                put('/users/username01').
                send({ name: 'A new name', token}).
                end((err, res) => {
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.be.equal('User updated');
                    User.findOne({username: 'username01', name: 'A new name'},
                        (e, u) => {
                            should.exist(u);
                            done();
                        });
                });
        });
    });
    it('should return 401 on PUT by any other user', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                put('/users/admin').
                send({ name: 'A new name', token}).
                end((err, res) => {
                    should.exist(err);
                    res.should.have.status(401);
                    res.body.message.should.be.equal('Not authorized');
                    User.findOne({username: 'username01', name: 'A new name'},
                        (e, u) => {
                            should.not.exist(u);
                            done();
                        });
                });
        });
    });

    it('should return 202 on DELETE by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                delete('/users/username02').
                send({token}).
                end((err, res) => {
                    should.exist(res);
                    res.should.have.status(202);
                    res.body.message.should.be.equal('User deleted');
                    done();
                });
        });
    });
    it('should return 403 on DELETE by any other user', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                delete('/users/username02').
                send({token}).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    res.should.have.status(401);
                    res.body.message.should.be.equal('Not authorized');
                    done();
                });
        });
    });
});
