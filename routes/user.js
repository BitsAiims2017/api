const router = require('express').Router();

// import util funtions
const lib = require('../lib/user.js');

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
    get((req, res) => {
        //TODO: Check authentication
        lib.get_all_users((err, data) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.send(data);
            }
        });
    }).

    /**
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @api {post} /user/ 1.2 Add a new user
     * @apiDescription This can only by used by admin to add a new user
     * @apiPermission admin
     *
     * @apiError 401 The request is not authorized
     * @apiError 409 User already exists
     * @apiError 500 Internal error
     */
    post((req, res) => {
        let data = {};

        //TODO: clean and validate user data
        data.name = req.body.name;
        data.username = req.body.username;
        data.password = req.body.password;
        data.role = req.body.role;

        //TODO: validate user (admin)

        lib.new_user(data, (err) => {
            res.status(err.status).send(err);
        });
    }).

    /* not supported */
    put((req, res) => {
        res.status(400).send(lib.invalid_request());
    }).
    delete((req, res) => {
        res.status(400).send(lib.invalid_request());
    });

router.route('/:username').
    /**
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @api {get} /user/:id 2.1 Request user information
     * @apiDescription This can be used to get user details
     *
     * @apiParam {Number} username The username of the user
     *
     * @apiSuccess {String} name Name of the user
     * @apiSuccess {String} role Role of the user
     *
     * @apiSuccessExample {json} Success:
     *  {
     *      "name": "Name",
     *      "username": "Username",
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
    get((req, res) => {
        lib.get_user(req.params.username, (err, data) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.send(data);
            }
        });
    }).

    /* not supported */
    post((req, res) => {
        res.status(400).send(lib.invalid_request());
    }).

    /**
     * @apiGroup User
     * @apiVersion 0.0.1
     *
     * @api {put} /user/:id 2.2 Change user information
     *
     * @apiParam {Number} username The username to be changed
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
     * @apiParam {Number} username The username to be deleted
     *
     * @apiError 403 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    delete((req, res) => {
        //TODO: Check authentication
        lib.delete_user(req.params.username, (data) => {
            res.status(data.status).send(data);
        });
    });

module.exports = router;
