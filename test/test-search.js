process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../server.js');
const util = require('../lib/test_util.js');
chai.use(chaiHttp);

describe('/search', () => {
    it('should return matching paginated documents on search');
    it('should have an option to limit results');
    it('should have an option to sort results');
    it('should have an option to search according to category');
    it('should have option to apply filters to search');

    it('should have a route to search users');
    it('should have a route to search items');
});
