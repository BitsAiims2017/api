const router = require('express').Router();

//import library functions
const lib = require('../lib/user.js');
const auth = require('../lib/auth.js');
const User = require('../models/user.js');

/**
 */
router.route('/')
    .post((req, res) => {
        //TODO: validate data
        const username = req.body.username;
        const password = req.body.password;

        lib.auth_user({username, password}, (err, data) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.send(data);
            }
        });
    });

module.exports = router;
