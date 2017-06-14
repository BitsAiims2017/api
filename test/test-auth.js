process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const config = require('../config/default.js');
const app = require('../server.js');
const User = require('../models/user.js');
const util = require('../lib/test_util.js');
chai.use(chaiHttp);

describe('/auth', () => {
    beforeEach(util.add_users);
    after(util.remove_all_users);

    it('should return 200 and a token on POST', (done) => {
        chai.
            request(app).
            post('/auth').
            send({
                username: 'admin',
                password: 'password1'
            }).
            end((err, res) => {
                should.not.exist(err);
                should.exist(res);
                res.should.have.status(200);
                res.body.should.be.an('Object');
                should.exist(res.body.token);
                should.not.exist(res.body.password);
                done();
            });
    });
    it('should return 404 if user does not exist', (done) => {
        chai.
            request(app).
            post('/auth').
            send({
                username: 'nouser',
                password: 'password01'
            }).
            end((err, res) => {
                should.exist(err);
                should.exist(res);
                res.should.have.status(404);
                res.body.should.be.an('Object');
                res.body.message.should.equal('User not found');
                done();
            });
    });
    it('should return 401 if wrong credentials', (done) => {
        chai.
            request(app).
            post('/auth').
            send({
                username: 'admin',
                password: 'wrongpassword'
            }).
            end((err, res) => {
                should.exist(err);
                should.exist(res);
                res.should.have.status(401);
                res.body.should.be.an('Object');
                res.body.message.should.equal('Wrong credentials');
                should.not.exist(res.body.token);
                done();
            });
    });
    it('should return 400 if no/incomplete credentials provided', (done) => {
        chai.
            request(app).
            post('/auth').
            send({
                username: 'admin'
            }).
            end((err, res) => {
                should.exist(err);
                should.exist(res);
                res.should.have.status(400);
                res.body.should.be.an('Object');
                res.body.message.should.equal('Incomplete parameters');
                should.not.exist(res.body.token);
                done();
            });
    });
});
