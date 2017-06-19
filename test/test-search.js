process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../server.js');
const util = require('../lib/test_util.js');
chai.use(chaiHttp);

describe('/search', () => {

    before(util.add_users);
    before(util.add_items);
    after(util.remove_all_users);
    after(util.remove_all_items);

    it('should return matching items on search', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/search/items?query=item+10').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    should.exist(res.body.data);
                    res.body.data.should.be.an('Array');
                    res.body.data.length.should.equal(1);
                    res.body.data[0].should.be.an('Object');
                    res.body.data[0].name.should.equal('Item 10');
                    done();
                });
        });
    });
    it('should return matching users on search', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/search/users?query=admin').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    should.exist(res.body.data);
                    res.body.data.should.be.an('Array');
                    res.body.data.length.should.equal(1);
                    res.body.data[0].should.be.an('Object');
                    res.body.data[0].name.should.equal('Administrator');
                    done();
                });
        });
    });

    it('should have an option to limit results', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/search/items?limit=5').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    should.exist(res.body.data);
                    res.body.data.should.be.an('Array');
                    res.body.data.length.should.equal(5);
                    done();
                });
        });
    });
    it('should have an option to limit results', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/search/users?limit=5').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    should.exist(res.body.data);
                    res.body.data.should.be.an('Array');
                    res.body.data.length.should.equal(2);
                    done();
                });
        });
    });
});
