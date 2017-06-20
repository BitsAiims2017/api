const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const User = require('../models/user.js');
const Item = require('../models/item.js');
const Report = require('../models/report.js');
const app = require('../server.js');

/**
 * Add sample users
 */
exports.add_users = (done) => {
    // remove all users
    User.remove({}, (err) => {
        // add an admin and a viewer
        User.collection.insertMany([ 
            { 
                username: 'admin',
                password: { hash: 'db026a1dc117b7beff39938bae6b486bb92228724ac496e355a3751f1710bf54a4fe0b15e668d3e0eb8458b5f68580cbae68eacd56e1903c06e32eae2ebbe545',
                    salt: '060d7f1a132b6086' }, // password1
                name: 'Administrator',
                role: 'admin'
            },
            {
                username: 'username01',
                password: { hash: 'aad7fc92e974c4d60b49fcb6f773b68504f73a0094e89ed34b95f896ea8244c7899e3def85c0c79985c2d72a7a9536f3d1d2a92e5a7b15a7a3e3b972bfe6eabe',
                    salt: '65537ea6d692d7c3' }, //password2
                name: 'User 01',
                role: 'viewer'
            }
        ], {}, done);
    });

};

/**
 * Remove all users
 */
exports.remove_all_users = (done) => {
    User.remove({}, (err) => {
        should.not.exist(err); 
        done();
    });
};

/**
 * Test a route for bad request
 */
exports.check_bad_request = (err, res) => {

    should.exist(err);
    should.exist(res);
    err.should.have.status(400);
    res.should.have.status(400);
    should.exist(res.body);
    res.body.message.should.equal('Invalid request');
};

/**
 * Login as a given user and return token
 */
exports.get_login_token = (role, done) => {
    let username, password;
    if (role === 'admin') {
        username = 'admin';
        password = 'password1';
    } else {
        username = 'username01';
        password = 'password2';
    }
    chai.
        request(app).
        post('/auth').
        send({username, password}).
        end((err, res) => {
            should.exist(res.body.token);
            done(res.body.token);
        });
};

/**
 * Add items to the database
 */
exports.add_items = (done) => {
    Item.collection.insertMany([
        { id: '1', name: 'Item 1', quantity: 20, price: 94, class: 'B' },
        { id: '2', name: 'Item 2', quantity: 22, price: 57, class: 'B' },
        { id: '3', name: 'Item 3', quantity: 92, price: 1, class: 'B' },
        { id: '4', name: 'Item 4', quantity: 77, price: 74, class: 'B' },
        { id: '5', name: 'Item 5', quantity: 34, price: 28, class: 'B' },
        { id: '6', name: 'Item 6', quantity: 17, price: 58, class: 'B' },
        { id: '7', name: 'Item 7', quantity: 6, price: 78, class: 'B' },
        { id: '8', name: 'Item 8', quantity: 100, price: 70, class: 'B' },
        { id: '9', name: 'Item 9', quantity: 16, price: 99, class: 'B' },
        { id: '10', name: 'Item 10', quantity: 43, price: 75, class: 'B' },
        { id: '11', name: 'Item 11', quantity: 66, price: 45, class: 'B' },
        { id: '12', name: 'Item 12', quantity: 94, price: 25, class: 'B' },
        { id: '13', name: 'Item 13', quantity: 99, price: 96, class: 'B' },
        { id: '14', name: 'Item 14', quantity: 87, price: 10, class: 'B' },
        { id: '15', name: 'Item 15', quantity: 69, price: 25, class: 'B' },
        { id: '16', name: 'Item 16', quantity: 95, price: 20, class: 'B' },
        { id: '17', name: 'Item 17', quantity: 71, price: 25, class: 'B' },
        { id: '18', name: 'Item 18', quantity: 49, price: 30, class: 'B' },
        { id: '19', name: 'Item 19', quantity: 92, price: 76, class: 'B' },
        { id: '20', name: 'Item 20', quantity: 40, price: 7, class: 'B' },
        { id: '21', name: 'Item 21', quantity: 29, price: 62, class: 'B' },
        { id: '22', name: 'Item 22', quantity: 13, price: 31, class: 'B' },
        { id: '23', name: 'Item 23', quantity: 2, price: 16, class: 'B' },
        { id: '24', name: 'Item 24', quantity: 65, price: 56, class: 'B' },
        { id: '25', name: 'Item 25', quantity: 68, price: 100, class: 'B' },
        { id: '26', name: 'Item 26', quantity: 76, price: 90, class: 'B' },
        { id: '27', name: 'Item 27', quantity: 86, price: 42, class: 'B' },
        { id: '28', name: 'Item 28', quantity: 6, price: 40, class: 'B' },
        { id: '29', name: 'Item 29', quantity: 1, price: 93, class: 'B' },
        { id: '30', name: 'Item 30', quantity: 14, price: 89, class: 'B' }
    ], done);
};

/**
 * Remove all the items from the database
 */
exports.remove_all_items = (done) => {
    Item.remove({}, done);
};

/**
 * Add reports to the database
 */
exports.add_reports = (done) => {
    Report.collection.insertMany([
        { id: 'report1',
            symptoms: 'symp1, symp2',
            diagnosis: 'some diag',
            conclusion: 'some conc',
            remark: 'some remark',
            diagnosed_by: ['some dr']
        },
        { id: 'report2',
            symptoms: 'symp1, symp2',
            diagnosis: 'some diag',
            conclusion: 'some conc',
            remark: 'some remark',
            diagnosed_by: ['some dr']
        },
        { id: 'report3',
            symptoms: 'symp1, symp2',
            diagnosis: 'some diag',
            conclusion: 'some conc',
            remark: 'some remark',
            diagnosed_by: ['some dr']
        },
        { id: 'report4',
            symptoms: 'symp1, symp2',
            diagnosis: 'some diag',
            conclusion: 'some conc',
            remark: 'some remark',
            diagnosed_by: ['some dr']
        },
        { id: 'report5',
            symptoms: 'symp1, symp2',
            diagnosis: 'some diag',
            conclusion: 'some conc',
            remark: 'some remark',
            diagnosed_by: ['some dr']
        },
        { id: 'report6',
            symptoms: 'symp1, symp2',
            diagnosis: 'some diag',
            conclusion: 'some conc',
            remark: 'some remark',
            diagnosed_by: ['some dr']
        },
        { id: 'report7',
            symptoms: 'symp1, symp2',
            diagnosis: 'some diag',
            conclusion: 'some conc',
            remark: 'some remark',
            diagnosed_by: ['some dr']
        },
        { id: 'report8',
            symptoms: 'symp1, symp2',
            diagnosis: 'some diag',
            conclusion: 'some conc',
            remark: 'some remark',
            diagnosed_by: ['some dr']
        },
        { id: 'report9',
            symptoms: 'symp1, symp2',
            diagnosis: 'some diag',
            conclusion: 'some conc',
            remark: 'some remark',
            diagnosed_by: ['some dr']
        },
        { id: 'report10',
            symptoms: 'symp1, symp2',
            diagnosis: 'some diag',
            conclusion: 'some conc',
            remark: 'some remark',
            diagnosed_by: ['some dr']
        }
    ], done);
};

/**
 * Remove all the reports from the database
 */
exports.remove_all_reports = (done) => {
    Report.remove({}, done);
};
