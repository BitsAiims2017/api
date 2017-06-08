const db = require('mongoose');
const config = require('./config.js');

// connect the database
db.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' +
    config.db.name)

// test the connection
db.connection.
    on('error', () => {
        console.error.bind(console, 'connection error:');
    }).
    once('open', () => {
        console.log('Database connected');
    });

module.exports = db;
