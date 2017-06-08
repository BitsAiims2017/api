const router = require('express').Router();

// import util funtions
const util = require('../util.js');

/**
 * @apiName AIIMS IMS
 * @apiGroup User
 * @apiVersion 0.0.1
 */

router.route('/').
    /**
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @api {get} /user/ 1.1 Request all users' information
     * @apiDescription This can only by used by admin to get the imformation
     * about all users in one place.
     * @apiPermission admin
     *
     * @apiSuccess {Array} Users Array of name and role for all users
     *
     * @apiSuccessExample {json} Success:
     *  [{
     *      "name": "User Name",
     *      "role": "User Role"
     *  }]
     *
     * @apiError 401 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "error": "Error Message"
     *  }
     */
    get((req, res) => { }).

    /**
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @api {post} /user/ 1.2 Add a new user
     * @apiDescription This can only by used by admin to add a new user
     * @apiPermission admin
     *
     * @apiError 401 The request is not authorized
     */
    post((req, res) => { }).

    /* not supported */
    put((req, res) => { }).
    delete((req, res) => { });

router.route('/:id').
    /**
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @api {get} /user/:id 2.1 Request user information
     * @apiDescription This can be used to get user details
     *
     * @apiParam {Number} id User ID
     *
     * @apiSuccess {String} name Name of the user
     * @apiSuccess {String} role Role of the user
     *
     * @apiSuccessExample {json} Success:
     *  {
     *      "name": "User Name",
     *      "role": "User Role"
     *  }
     *
     * @apiError 400 The resuest is not supported
     * @apiError 401 The request is not authorized
     * @apiError 403 The request is not authorized
     * @apiError 404 The user was not found
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "error": "Error Message"
     *  }
     */
    get((req, res) => { }).

    /* not supported */
    post((req, res) => { }).

    /**
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @api {put} /user/:id 2.2 Change user information
     *
     * @apiParam {Number} id User ID
     * @apiParam {String} name (optional) New name
     *
     * @apiSuccessExample {json} Success:
     *  {
     *      "id": "User ID",
     *      "name": "New Name",
     *      "role": "User Role"
     *  }
     *
     * @apiError 403 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "error": "Error Message"
     *  }
     */
    put((req, res) => { }).

    /**
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @api {delete} /user/:id 2.3 Delete user
     * @apiPermission admin
     *
     * @apiParam {Number} id User ID
     *
     * @apiError 403 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "error": "Error Message"
     *  }
     */
    delete((req, res) => { });

module.exports = router;
