const router = require('express').Router();

/**
 * @apiName AIIMS IMS
 * @apiGroup General
 * @api {get} / Request something
 *
 * @apiParam {Number} id ID of something
 * @apiParam {Number} num Total number of somethings
 *
 *
 * @apiSuccess {String} something Something
 * @apiSuccess {Number} number Total number of something returned
 * @apiSuccessExample {json} Success:
 *    {
 *      "something": "This is something",
 *      "number": 10
 *    }
 *
 * @apiError SomethingNotFound No something of that ID was found
 * @apiErrorExample {json} Error:
 *    {
 *      "error": "error msg"
 *    }
 */
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
