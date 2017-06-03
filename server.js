// start using strict ES6
"using strict";

const express = require('express');
const app = express();
const logger = require('morgan')('tiny');

// config options
const config = {
    'host': 'localhost',
    'port': 2000
};

app
    // add a logger
    .use(logger)

    // add default routes
    .use('/', require('./routes/index.js'))

    // start the app
    .listen(config.port, config.host, () => {
        console.log('Listening on ' + config.host + ':' + config.port);
    });
