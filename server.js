// start using strict ES6
'using strict';

const express = require('express');
const app = express();
const logger = require('morgan')('tiny');

// load config
const config = require('./config.js');

// add app middlewares and start app
app.
    // add a logger
    use(logger).

    // add default routes
    use('/', require('./routes/index.js')).

    // start the app
    listen(config.port, config.host, () => {
        console.log('Listening on ' + config.host + ':' + config.port);
    });
