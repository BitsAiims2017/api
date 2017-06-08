const router = require('express').Router();

// import util funtions
const util = require('../util.js');

router.route('/').
    get((req, res) => {
        res.sendStatus(200);
    }).
    post((req, res) => {
        res.sendStatus(400);
    }).
    put((req, res) => {
        res.sendStatus(400);
    }).
    delete((req, res) => {
        res.sendStatus(400);
    });

module.exports = router;
