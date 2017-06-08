process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

// use Chai-Http for http requests
chai.use(chaiHttp);

let server = require('../server');
const config = require('../config.js');

const app = require('../server.js');

describe('/', () => {

    // test the get route
    it('should return 200 on GET', done => {
        chai.
            request(app).
            get('/').
            end((err, res) => {
                should.not.exist(err);
                res.should.have.status(200);
                done();
            });
    });
    it('should return 404 on POST');
    it('should return 404 on PUT');
    it('should return 404 on DELETE');
});
