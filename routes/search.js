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
    /**
     * @apiGroup Search
     * @apiVersion 0.0.1
     *
     * @api {get} /search/users?params 1.1 Search for users
     *
     * @apiParam query The query to search for
     * @apiParam limit The number of items in result
     * @apiParam sort The field to sort according to
     * @apiParam order The order to sort with 'asc' or 'desc'
     * @apiPermission admin, viewer, doctor
     *
     * @apiSuccessExample {json} Success:
     *  {
     *      "status": "Status code",
     *      "data": [{Objects}]
     *  }
     *
     * @apiError 401 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    get(auth.authenticate({roles: [ 'viewer', 'doctor' ]}), (req, res) => {
        lib.search_users(req.query, (data) => {
            res.status(data.status).send(data);
        });
    });

router.route('/items').
    /**
     * @apiGroup Search
     * @apiVersion 0.0.1
     *
     * @api {get} /search/items?params 1.2 Search for items
     *
     * @apiParam query The query to search for
     * @apiParam limit The number of items in result
     * @apiParam sort The field to sort according to
     * @apiParam order The order to sort with 'asc' or 'desc'
     * @apiPermission admin, viewer, inventory, doctor
     *
     * @apiSuccessExample {json} Success:
     *  {
     *      "status": "Status code",
     *      "data": [{Objects}]
     *  }
     *
     * @apiError 401 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    get(auth.authenticate({roles: [ 'viewer', 'inventory', 'doctor' ]}),
    (req, res) => {
        lib.search_items(req.query, (data) => {
            res.status(data.status).send(data);
        });
    });

module.exports = router;
