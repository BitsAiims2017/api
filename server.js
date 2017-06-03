const express = require('express');
const app = express();

// config options
const config = {
    'host': 'localhost',
    'port': 2000
};

// routes
app.get('/', function (req, res) {
    res.send('Hello, AIIMS');
});

// start the app
app.listen(config.port, config.host, function () {
    console.log('Listening on ' + config.host + ':' + config.port);
});
