process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const config = require('../config/default.js');
const app = require('../server.js');
const Item = require('../models/item.js');
const util = require('../lib/test_util.js');
chai.use(chaiHttp);

describe('/items', () => {

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

    it('should return the specific item on GET by admin');
    it('should return the specific item on GET by viewer');
    it('should return nothing on empty database');

    it('should do nothing on POST by admin');
    it('should do nothing on POST by viewer');

    it('should change details on PUT by admin');
    it('should not change details on PUT by viewer');

    it('should delete the item on DELETE by admin');
    it('should not delete the item on DELETE by admin');
});
