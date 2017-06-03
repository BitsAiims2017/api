const router = require('express').Router();

router.route('/')
    .get(function (req, res) {
        // handle get request
        res.send('Hello, AIIMS');
    })
    .post(function (req, res) {
        // handle post request
    })
    .put(function (req, res) {
        // handle put request
    })
    .delete(function (req, res) {
        // handle delete request
    });

module.exports = router;
