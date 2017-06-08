// start using strict ES6
'using strict';

const express = require('express');
const app = express();
const logger = require('morgan');

const config = require('./config.js'); // load config

if (process.env.NODE_ENV != 'test') {
    app.use(logger('dev')); // add a logger
}

// set json properties
app.set('json spaces', 2);
app.locals.pretty = true;

// add routes
app.use('/', require('./routes/index.js'));
app.use('/user', require('./routes/user.js'));

// start the app
app.listen(config.port, config.host, () => {
        console.log('Listening on ' + config.host + ':' + config.port);
});

module.exports = app; // for use in testing
