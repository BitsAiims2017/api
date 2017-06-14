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
    before(util.add_items);
    after(util.remove_all_users);
    after(util.remove_all_items);

    it('should return all items on GET by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/items').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.items.length.should.equal(10);
                    should.exist(res.body.meta.next);
                    should.not.exist(res.body.meta.prev);
                    done();
                });
        });
    });
    it('should return all items on GET by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                get('/items').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.items.length.should.equal(10);
                    should.exist(res.body.meta.next);
                    should.not.exist(res.body.meta.prev);
                    done();
                });
        });
    });
    it('should correctly result paginated results', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                get('/items?page=4&size=5').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.items.length.should.equal(5);
                    should.exist(res.body.meta.next);
                    should.exist(res.body.meta.prev);
                    done();
                });
        });
    });

    it('should add an item on POST by admin', (done) => {
        util.remove_all_items();
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/items').
                send({
                    id: 90,
                    name: 'Item 7',
                    quantity: 40,
                    price: 30.5,
                    class: 'C',
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(201);
                    res.body.message.should.equal('Item added');
                    Item.find({}, (e, d) => { d.length.should.equal(31); });
                    done();
                });
        });
    });
    it('should not add an item on POST by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                post('/items').
                send({
                    id: 90,
                    name: 'Item 7',
                    quantity: 40,
                    price: 30.5,
                    class: 'C',
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
    it('should not add an item with empty id or name', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/items').
                send({
                    name: 'Item 2',
                    quantity: 40,
                    price: 30.5,
                    class: 'C',
                    token
                }).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    res.should.have.status(400);
                    res.body.message.should.equal('Incomplete parameters');
                    done();
                });
        });
    });
    it('should not add an item with duplicate id', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/items').
                send({
                    id: '2',
                    name: 'Item 2',
                    quantity: 40,
                    price: 30.5,
                    class: 'C',
                    token
                }).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    res.should.have.status(409);
                    res.body.message.should.equal('Item already exists');
                    done();
                });
        });
    });

    it('should do nothing on PUT', (done) => {
        chai.
            request(app).
            put('/items').
            end(util.check_bad_request);
        done();
    });

    it('should do nothing on DELETE', (done) => {
        chai.
            request(app).
            delete('/items').
            end(util.check_bad_request);
        done();
    });
});

describe('/items/:id', () => {

    before(util.add_users);
    beforeEach(util.add_items);
    after(util.remove_all_users);
    afterEach(util.remove_all_items);

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
                    res.body.quantity.should.equal(92);
                    res.body.price.should.equal(1);
                    res.body.class.should.equal('B');
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
                    res.body.quantity.should.equal(92);
                    res.body.price.should.equal(1);
                    res.body.class.should.equal('B');
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

    it('should do nothing on POST', (done) => {
        chai.
            request(app).
            post('/items/10').
            end(util.check_bad_request);
        done();
    });

    it('should change some details on PUT by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                put('/items/3').
                send({
                    name: 'Item 3.1',
                    price: 56,
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.equal('Item updated');
                    Item.findOne({id:'3', name: 'Item 3.1', price: 56},
                        (err, item) => {
                            should.not.exist(err);
                            should.exist(item);
                            done();
                        });
                });
        });
    });
    it('should change all details on PUT by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                put('/items/3').
                send({
                    id:'3.1',
                    name: 'Item 3.1',
                    price: 56,
                    quantity: 70,
                    class: 'D',
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.equal('Item updated');
                    Item.findOne({
                        id:'3.1',
                        name: 'Item 3.1',
                        price: 56,
                        quantity: 70,
                        class: 'D'
                    }, (err, item) => {
                        should.not.exist(err);
                        should.exist(item);
                        done();
                    });
                });
        });
    });
    it('should not change details on PUT by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                put('/items/3').
                send({name: 'New name', token}).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    res.should.have.status(401);
                    res.body.message.should.equal('Not authorized');
                    done();
                });
        });
    });
    it('should not give in to injection attacks', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                put('/items/3').
                send({
                    class: 'D',
                    'while(1)': 'this',
                    ']console.log(this)': 'this',
                    '0];console.log(this)': 'this',
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.equal('Item updated');
                    Item.findOne({
                        class: 'D'
                    }, (err, item) => {
                        should.not.exist(err);
                        should.exist(item);
                        done();
                    });
                });
        });
    });

    it('should delete the item on DELETE by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                delete('/items/3').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.equal('Item deleted');
                    done();
                });
        });
    });
    it('should not delete the item on DELETE by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                delete('/items/3').
                send({token}).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    res.should.have.status(401);
                    res.body.message.should.equal('Not authorized');
                    done();
                });
        });
    });
});
