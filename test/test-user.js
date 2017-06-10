process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const config = require('../config.js');
const app = require('../server.js');
const User = require('../models/user.js');

chai.use(chaiHttp);

describe('/user', () => {

    beforeEach((done) => {
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
    });

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
                User.find({}, (e, p) => { p.length.should.equal(3) });
                done();
            });
    });
    it('should return 409 on POST with same user_id twice');
    it('should return 409 on POST with same username twice');
    it('should return 400 on PUT');
    it('should return 400 on DELETE');

    after(() => {
        // remove all users
        User.remove({}, (err) => { should.not.exist(err); });
    });
});

describe('/user/:id', () => {
    it('should return 200 and user details on GET by admin');
    it('should return 200 and user details on GET by user of ID = id');
    it('should return 404 for user not found on GET');
    it('should return 400 on POST');
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
