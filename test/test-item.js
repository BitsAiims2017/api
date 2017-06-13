process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../server.js');
const Item = require('../models/item.js');
const util = require('../lib/test_util.js');
chai.use(chaiHttp);

describe('/items', () => {

    before(util.add_users);
    after(util.remove_all_users);

    it('should return all items on GET by viewer');
    it('should return all items on GET by admin');
    it('should return nothing on empty database');

    it('should add an item on POST by admin');
    it('should not add an item on POST by viewer');

    it('should do nothing on PUT by admin');
    it('should do nothing on PUT by viewer');

    it('should do nothing on DELETE by admin');
    it('should do nothing on DELETE by viewer');
});

describe('/items/:id', () => {

    before(util.add_users);
    before(util.add_items);
    after(util.remove_all_users);
    after(util.remove_all_items);

    it('should return the specific item on GET by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                get('/items/3').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.name.should.equal('Item 3');
                    res.body.quantity.should.equal(30);
                    res.body.price.should.equal(30.5);
                    res.body.class.should.equal('A');
                    done();
                });
        });
    });
    it('should return the specific item on GET by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/items/3').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.name.should.equal('Item 3');
                    res.body.quantity.should.equal(30);
                    res.body.price.should.equal(30.5);
                    res.body.class.should.equal('A');
                    done();
                });
        });
    });
    it('should return nothing on item not found', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/items/40').
                send({token}).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    res.should.have.status(404);
                    res.body.message.should.equal('Not found');
                    done();
                });
        });
    });

    it('should do nothing on POST by admin');
    it('should do nothing on POST by viewer');

    it('should change details on PUT by admin');
    it('should not change details on PUT by viewer');

    it('should delete the item on DELETE by admin');
    it('should not delete the item on DELETE by admin');
});
