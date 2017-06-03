const router = require('express').Router();

router.route('/')
    .get((req, res) => {
        // handle get request
        res.send('Hello, AIIMS');
    })
    .post((req, res) => {
        // handle post request
    })
    .put((req, res) => {
        // handle put request
    })
    .delete((req, res) => {
        // handle delete request
    });

module.exports = router;
