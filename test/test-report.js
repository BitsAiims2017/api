process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../server.js');
const Report = require('../models/report.js');
const util = require('../lib/test_util.js');
chai.use(chaiHttp);

describe('/reports', () => {

    before(util.add_users);
    before(util.add_reports);
    after(util.remove_all_users);
    after(util.remove_all_reports);

    it('should return all reports on GET by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/reports').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.reports.length.should.equal(10);
                    should.exist(res.body.meta.next);
                    should.not.exist(res.body.meta.prev);
                    done();
                });
        });
    });
    it('should return all reports on GET by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                get('/reports').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.reports.length.should.equal(10);
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
                get('/reports?page=1&size=5').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.reports.length.should.equal(5);
                    should.exist(res.body.meta.next);
                    done();
                });
        });
    });

    it('should add a report on POST by admin', (done) => {
        util.remove_all_reports();
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/reports').
                send({
                    id: 'report 40',
                    symptoms: 'headache',
                    diagnosis: 'CT Scan',
                    conclusion: 'Tumor',
                    remark: 'Admit',
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(201);
                    res.body.message.should.equal('Report added');
                    Report.find({}, (e, d) => { d.length.should.equal(11); });
                    done();
                });
        });
    });
    it('should not add a report on POST by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                post('/reports').
                send({
                    id: 'report 40',
                    symptoms: 'headache',
                    diagnosis: 'CT Scan',
                    conclusion: 'Tumor',
                    remark: 'Admit',
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
    it('should not add an report with empty id or name', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/reports').
                send({
                    symptoms: 'headache',
                    diagnosis: 'CT Scan',
                    conclusion: 'Tumor',
                    remark: 'Admit',
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
    it('should not add an report with duplicate id', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/reports').
                send({
                    id: 'report1',
                    symptoms: 'headache',
                    diagnosis: 'CT Scan',
                    conclusion: 'Tumor',
                    remark: 'Admit',
                    token
                 }).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    res.should.have.status(409);
                    res.body.message.should.equal('Report already exists');
                    done();
                });
        });
    });

    it('should do nothing on PUT', (done) => {
        chai.
            request(app).
            put('/reports').
            end(util.check_bad_request);
        done();
    });

    it('should do nothing on DELETE', (done) => {
        chai.
            request(app).
            delete('/reports').
            end(util.check_bad_request);
        done();
    });
});

describe('/reports/:id', (done) => {

    before(util.add_users);
    beforeEach(util.add_reports);
    after(util.remove_all_users);
    afterEach(util.remove_all_reports);

    it('should return the specific report on GET by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                get('/reports/report1').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.symptoms.should.equal('symp1, symp2');
                    res.body.diagnosis.should.equal('some diag');
                    res.body.conclusion.should.equal('some conc');
                    res.body.remark.should.equal('some remark');
                    res.body.diagnosed_by[0].should.equal('some dr');
                    done();
                });
        });
    });
    it('should return the specific report on GET by viewer', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                get('/reports/report1').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.symptoms.should.equal('symp1, symp2');
                    res.body.diagnosis.should.equal('some diag');
                    res.body.conclusion.should.equal('some conc');
                    res.body.remark.should.equal('some remark');
                    res.body.diagnosed_by[0].should.equal('some dr');
                    done();
                });
        });
    });
    it('should return nothing on report not found', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/reports/report40').
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
            post('/reports/10').
            end(util.check_bad_request);
        done();
    });

    it('should change some details on PUT by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                put('/reports/report3').
                send({
                    symptoms: 'Pain',
                    diagnosis: 'X-Ray',
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.equal('Report updated');
                    Report.findOne(
                        {id:'report3', symptoms: 'Pain', diagnosis: 'X-Ray'},
                        (err, report) => {
                            should.not.exist(err);
                            should.exist(report);
                            done();
                        });
                });
        });
    });
    it('should change all details on PUT by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                put('/reports/report4').
                send({
                    id:'3.1',
                    symptoms: 'Pain',
                    diagnosis: 'X-Ray',
                    conclusion: 'Fracture',
                    remark: 'Plaster',
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.equal('Report updated');
                    Report.findOne({
                        id:'3.1',
                        symptoms: 'Pain',
                        diagnosis: 'X-Ray',
                        conclusion: 'Fracture',
                        remark: 'Plaster'
                    }, (err, report) => {
                        should.not.exist(err);
                        should.exist(report);
                        done();
                    });
                });
        });
    });
    it('should not change details on PUT by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                put('/reports/report3').
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
                put('/reports/report3').
                send({
                    symptoms: 'something',
                    'while(1)': 'this',
                    ']console.log(this)': 'this',
                    '0];console.log(this)': 'this',
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.equal('Report updated');
                    Report.findOne({
                        symptoms: 'something'
                    }, (err, report) => {
                        should.not.exist(err);
                        should.exist(report);
                        done();
                    });
                });
        });
    });

    it('should delete the report on DELETE by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                delete('/reports/3').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.equal('Report deleted');
                    done();
                });
        });
    });
    it('should not delete the report on DELETE by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                delete('/reports/3').
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
