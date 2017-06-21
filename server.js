// start using strict ES6
'using strict';

const express = require('express');
const app = express();
const logger = require('morgan');
const cookie_parser = require('cookie-parser');
const body_parser = require('body-parser');
const config = require('./config/default.js');
const favicon = require('serve-favicon');
const port = process.env.PORT || config.port;
const host = process.env.HOST || config.host;


// add a logger if env is not test
if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}

// set json properties
app.set('json spaces', 2);
app.locals.pretty = true;

// set req and res properties
app.use((req, res, next) => {
    req.accepts(['html', 'json']);
    res.set('Content-type', 'application/json');
    res.type('json');
    next();
} );

// add a favicon
app.use(favicon(__dirname + '/data/favicon.png'));

// add cookie and body parsers
app.use(cookie_parser(config.cookie_secret));
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));

// add routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/user.js'));
app.use('/items', require('./routes/item.js'));
app.use('/reports', require('./routes/report.js'));
app.use('/auth', require('./routes/auth.js'));
app.use('/search', require('./routes/search.js'));

// send 'bad request' if no route found
app.use('*', (req, res, next) => {
    res.status(400).send({status: 400, message: 'Bad request'});
});

// start the app
app.listen(port, host, () => {
    console.log('Listening on ' + host + ':' + port);
});

module.exports = app; // for use in testing
