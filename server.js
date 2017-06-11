// start using strict ES6
'using strict';

const express = require('express');
const app = express();
const logger = require('morgan');
const cookie_parser = require('cookie-parser');
const body_parser = require('body-parser');

const config = require('./config/default.js'); // load config

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev')); // add a logger
}

// set json properties
app.set('json spaces', 2);
app.locals.pretty = true;

// add cookie and body parsers
app.use(cookie_parser(config.cookie_secret));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

// add routes
app.use('/', require('./routes/index.js'));
app.use('/user', require('./routes/user.js'));

// start the app
app.listen(process.env.PORT || config.port, process.env.HOST || config.host,
    () => {
        console.log('Listening on ' + config.host + ':' + config.port);
});

module.exports = app; // for use in testing
