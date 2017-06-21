process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const app = require('../server.js');
const Patient = require('../models/patient.js');
const util = require('../lib/test_util.js');
chai.use(chaiHttp);

describe('/patients', () => {

    before(util.add_users);
    before(util.add_patients);
    after(util.remove_all_users);
    after(util.remove_all_patients);

    it('should return all patients on GET by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/patients').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.patients.length.should.equal(10);
                    should.exist(res.body.meta.next);
                    should.not.exist(res.body.meta.prev);
                    done();
                });
        });
    });
    it('should return all patients on GET by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                get('/patients').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.patients.length.should.equal(10);
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
                get('/patients?page=1&size=5').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.patients.length.should.equal(5);
                    should.exist(res.body.meta.next);
                    done();
                });
        });
    });

    it('should add a patient on POST by admin', (done) => {
        util.remove_all_patients();
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/patients').
                send({
                    id: 'Patient11',
                    name: 'ABC',
                    dob: new Date(1997, 10, 25),
                    gender: 'Male',
                    blood_group: 'B+',
                    reports: ['123'],
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(201);
                    res.body.message.should.equal('Patient added');
                    Patient.find({}, (e, d) => { d.length.should.equal(11); });
                    done();
                });
        });
    });
    it('should not add a patient on POST by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                post('/patients').
                send({
                    id: 'Patient11',
                    name: 'ABC',
                    dob: new Date(1997, 10, 25),
                    gender: 'Male',
                    blood_group: 'B+',
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
    it('should not add a patient with empty id or name', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/patients').
                send({
                    name: 'ABC',
                    dob: new Date(1997, 10, 25),
                    gender: 'Male',
                    blood_group: 'B+',
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
    it('should not add a patient with duplicate id', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                post('/patients').
                send({
                    id: 'patient1',
                    name: 'ABC',
                    dob: new Date(1997, 10, 25),
                    gender: 'Male',
                    blood_group: 'B+',
                    token
                 }).
                end((err, res) => {
                    should.exist(err);
                    should.exist(res);
                    res.should.have.status(409);
                    res.body.message.should.equal('Patient already exists');
                    done();
                });
        });
    });

    it('should do nothing on PUT', (done) => {
        chai.
            request(app).
            put('/patients').
            end(util.check_bad_request);
        done();
    });

    it('should do nothing on DELETE', (done) => {
        chai.
            request(app).
            delete('/patients').
            end(util.check_bad_request);
        done();
    });
});

describe('/patients/:id', (done) => {

    before(util.add_users);
    beforeEach(util.add_patients);
    after(util.remove_all_users);
    afterEach(util.remove_all_patients);

    it('should return the specific patient on GET by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                get('/patients/patient1').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.name.should.equal('name');
                    Date.parse(new Date(1996, 10, 25)).should.equal(Date.parse(res.body.dob));
                    should.exist(res.body.age);
                    res.body.gender.should.equal('gender');
                    res.body.blood_group.should.equal('blood group');
                    res.body.open_consultation[0].should.equal('some ids');
                    done();
                });
        });
    });
    it('should return the specific patient on GET by viewer', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                get('/patients/patient1').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.should.be.an('Object');
                    res.body.name.should.equal('name');
                    Date.parse(new Date(1996, 10, 25)).should.equal(Date.parse(res.body.dob));
                    should.exist(res.body.age);
                    res.body.gender.should.equal('gender');
                    res.body.blood_group.should.equal('blood group');
                    res.body.open_consultation[0].should.equal('some ids');
                    done();
                });
        });
    });
    it('should return nothing on patient not found', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                get('/patients/patient40').
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
            post('/patients/10').
            end(util.check_bad_request);
        done();
    });

    it('should change some details on PUT by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                put('/patients/patient3').
                send({
                    name: 'DEF',
                    dob: new Date(1998, 10, 25),
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.equal('Patient updated');
                    Patient.findOne(
                        {id:'patient3', name: 'DEF', dob: new Date(1998, 10, 25),},
                        (err, patient) => {
                            should.not.exist(err);
                            should.exist(patient);
                            done();
                        });
                });
        });
    });
    it('should change all details on PUT by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                put('/patients/patient4').
                send({
                    id:'3.1',
                    name: 'DEF',
                    dob: new Date(1998, 10, 25),
                    gender: 'Female',
                    blood_group: 'A+',
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.equal('Patient updated');
                    Patient.findOne({
                        id:'3.1',
                        name: 'DEF',
                        dob: new Date(1998, 10, 25),
                        gender: 'Female',
                        blood_group: 'A+'
                    }, (err, patient) => {
                        should.not.exist(err);
                        should.exist(patient);
                        done();
                    });
                });
        });
    });
    it('should not change details on PUT by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                put('/patients/patient3').
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
                put('/patients/patient3').
                send({
                    name: 'something',
                    'while(1)': 'this',
                    ']console.log(this)': 'this',
                    '0];console.log(this)': 'this',
                    token
                }).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.equal('Patient updated');
                    Patient.findOne({
                        name: 'something'
                    }, (err, patient) => {
                        should.not.exist(err);
                        should.exist(patient);
                        done();
                    });
                });
        });
    });

    it('should delete the patient on DELETE by admin', (done) => {
        util.get_login_token('admin', (token) => {
            chai.
                request(app).
                delete('/patients/patient3').
                send({token}).
                end((err, res) => {
                    should.not.exist(err);
                    should.exist(res);
                    res.should.have.status(200);
                    res.body.message.should.equal('Patient deleted');
                    done();
                });
        });
    });
    it('should not delete the patient on DELETE by viewer', (done) => {
        util.get_login_token('viewer', (token) => {
            chai.
                request(app).
                delete('/patients/patient3').
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
