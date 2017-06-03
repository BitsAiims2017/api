const assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

// use Chai-Http for http requests
chai.use(chaiHttp);

let server = require('../server');
const config = {
    'host': 'localhost',
    'port': 2000
};

describe('on /', function () {

    // test the get route
    describe('GET', function () {
        it('should get 200 status and return nothing', function () {
            chai.request('http://localhost:2000')
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});
