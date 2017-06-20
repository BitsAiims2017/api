const router = require('express').Router();

//import library functions
const lib = require('../lib/user.js');
const auth = require('../lib/auth.js');
const validate = require('../lib/validate.js');
const User = require('../models/user.js');

/**
 * @apiName AIIMS IMS
 * @apiGroup Login
 * @apiVersion 0.0.1
 */

router.use(auth.limiter);

/**
 */
router.route('/').
    /**
     * @apiGroup Login
     * @apiVersion 0.0.1
     *
     * @api {post} /auth 1.1 Request login token
     * @apiDescription Sending a post to this route will return a login
     * token which should be sent with every request to access data.
     * There is no need for logout since the token expires after a fixed
     * time anyway
     *
     * @apiSuccess token An access token
     *
     * @apiSuccessExample {json} Success:
     * {
     *      "token": "an access token"
     * }
     *
     * @apiError 400 Empty/invalid request
     * @apiError 401 Wrong credentials
     * @apiError 404 User does not exist
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    post((req, res) => {
        if (! validate.contains(req.body, ['username', 'password'])) {
            res.status(400)
                .send({error: 400, message: 'Incomplete parameters'});
        }
        else {
            const username = req.body.username;
            const password = req.body.password;

            lib.auth_user({username, password}, (err, data) => {
                if (err) {
                    res.status(err.status).send(err);
                } else {
                    res.send(data);
                }
            });
        }
    });

module.exports = router;
