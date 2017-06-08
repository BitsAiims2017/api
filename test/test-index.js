process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const config = require('../config.js');
const app = require('../server.js');

chai.use(chaiHttp);

describe('/', () => {
    it('should return 200 on GET', (done) => {
        chai.
            request(app).
            get('/').
            end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                done();
            });
    });
    it('should return 400 on POST', (done) => {
        chai.
            request(app).
            post('/').
            end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });
    it('should return 400 on PUT', (done) => {
        chai.
            request(app).
            put('/').
            end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });
    it('should return 400 on DELETE', (done) => {
        chai.
            request(app).
            delete('/').
            end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });
});
