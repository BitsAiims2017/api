const router = require('express').Router();

// import util funtions
const lib = require('../lib/search.js');
const auth = require('../lib/auth.js');
const validate = require('../lib/validate.js');

/**
 * @apiName AIIMS IMS
 * @apiGroup Search
 * @apiVersion 0.0.1
 */

// decode token and put data in req as 'req.data'
router.use(auth.decode_token);

router.route('/users').
    get(auth.authenticate({role: 'viewer'}), (req, res) => {
        lib.search_users(req.query, (data) => {
            res.status(data.status).send(data);
        });
    });

router.route('/items').
    get(auth.authenticate({role: 'viewer'}), (req, res) => {
        lib.search_items(req.query, (data) => {
            res.status(data.status).send(data);
        });
    });

module.exports = router;
