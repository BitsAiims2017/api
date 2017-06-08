process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const config = require('../config.js');
const app = require('../server.js');

chai.use(chaiHttp);

describe('/user', () => {
    it('should return 401 on GET by non admin');
    it('should return 200 and all users on GET by admin');
    it('should return 401 on POST by non admin');
    it('should return 201 on POST by admin');
    it('should return 400 on PUT');
    it('should return 400 on DELETE');
});

describe('/user/:id', () => {
    it('should return 200 and user details on GET by admin');
    it('should return 200 and user details on GET by user of ID = id');
    it('should return 404 for user not found on GET');
    it('should return 400 on POST');
    it('should return 202 on PUT by user of ID = id');
    it('should return 202 on PUT by admin');
    it('should return 403 on PUT by any other user');
    it('should return 202 on DELETE by user of ID = id');
    it('should return 202 on DELETE by admin');
    it('should return 403 on DELETE by any other user');
});
