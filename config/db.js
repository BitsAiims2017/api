const db = require('mongoose');
const config = require('../config/default.js');

if (process.env.NODE_ENV === 'test') {
    config.db.name = 'test_db';
    config.db.username = 'test_user';
    config.db.password = 'test_password';
}

// connect the database
db.connect(process.env.MONGODB_DB_URL || 'mongodb://' + config.db.host
    + ':' + config.db.port + '/' + config.db.name);

// test the connection
db.connection.
    on('error', () => {
        console.log('Could not connect to database');
        console.error.bind(console, 'connection error:');
    }).
    once('open', () => {
        if (process.env.NODE_ENV !== 'test') {
            console.log('Database "' + config.db.name + '" connected');
        }
    });

db.Promise = global.Promise;
module.exports = db;
