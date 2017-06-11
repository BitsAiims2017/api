process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const config = require('../config/default.js');
const app = require('../server.js');
const User = require('../models/user.js');

chai.use(chaiHttp);

describe('/auth', () => {
    before((done) => {
        chai.
            request(app).
            post('/user').
            send({
                username: 'admin',
                name: 'Administrator',
                password: 'password01',
                role: 'admin'
            }).
            end((req, res) => {
                done();
            });
    });

    it('should return 200 and a token on POST', (done) => {
        chai.
            request(app).
            post('/auth').
            send({
                username: 'admin',
                password: 'password01'
            }).
            end((err, res) => {
                should.not.exist(err);
                should.exist(res);
                res.should.have.status(200);
                res.body.should.be.an('Object');
                res.body.name.should.equal('Administrator');
                res.body.username.should.equal('admin');
                res.body.role.should.equal('admin');
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
                done();
            });
    });
    it('should return 400 if no/incomplete credentials provided');
});