const router = require('express').Router();

// import util funtions
const lib = require('../lib/report.js');
const auth = require('../lib/auth.js');
const validate = require('../lib/validate.js');

// decode token and put data in req as 'req.data'
router.use(auth.decode_token);

/**
 * @apiName AIIMS IMS
 * @apiGroup Report
 * @apiVersion 0.0.1
 */

router.route('/').
    /**
     * @apiGroup Report
     * @apiVersion 0.0.1
     *
     * @api {get} /report?params 1.1 Request all reports
     * @apiParam page The page number of reports
     * @apiParam size The number of reports on each page
     * @apiParam sort The field to sort according to
     * @apiParam order The order to sort with 'asc' or 'desc'
     *
     * @apiSuccess {Array} Reports Array of all reports
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
        lib.get_all_reports(req.query, (err, data) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.links({
                    next: data.meta.next,
                    prev: data.meta.prev
                });
                res.send(data);
            }
        });
    }).

    /**
     * @apiGroup Report
     * @apiVersion 0.0.1
     *
     * @api {post} /report 1.2 Add a new report
     * @apiDescription This can only by used by admin to add a new report
     * @apiPermission admin
     *
     * @apiError 401 The request is not authorized
     * @apiError 409 Report already exists
     */
    post(auth.authenticate({roles: [ 'admin', 'doctor' ]}), (req, res) => {
        if(! validate.contains(req.body, ['id', 'symptoms'])) {
            res.status(400)
                .send({error: 400, message: 'Incomplete parameters'});
        }
        req.body.diagnosed_by = req.data.username;

        lib.add_report(req.body, (add_res) => {
            res.status(add_res.status).send(add_res);
        });
    }).

    /* not supported */
    put((req, res) => {
        res.status(400).send(lib.invalid_request());
    }).
    delete((req, res) => {
        res.status(400).send(lib.invalid_request());
    });

router.route('/:id').
    /**
     * @apiGroup Report
     * @apiVersion 0.0.1
     *
     * @api {get} /report/:id 2.1 Request report information
     * @apiDescription This can be used to get report details
     *
     * @apiParam {String} id The id of the report
     *
     * @apiError 401 The request is not authorized
     * @apiError 403 The request is not authorized
     * @apiError 404 The report was not found
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    get(auth.authenticate({roles: [ 'viewer', 'doctor' ]}), (req, res) => {
        lib.get_report(req.params.id, (err, report) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.send(report);
            }
        });
    }).

    /* not supported */
    post((req, res) => {
        res.status(400).send(lib.invalid_request());
    }).

    /**
     * @apiGroup Report
     * @apiVersion 0.0.1
     *
     * @api {put} /report/:id 2.2 Change report information
     *
     * @apiParam {Number} report The id of the report to be changed
     * @apiParam {Type} parameter The parameter to change
     *
     * @apiError 403 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    put(auth.authenticate({roles: [ 'admin', 'doctor' ]}), (req, res) => {
        lib.update_report(req.params.id, req.body, (err, upd_res) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.send(upd_res);
            }
        });
    }).

    /**
     * @apiGroup Report
     * @apiVersion 0.0.1
     *
     * @api {delete} /report/:id 2.3 Delete report
     * @apiPermission admin
     *
     * @apiParam {Number} id The id of report to be deleted
     *
     * @apiError 403 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    delete(auth.authenticate({role: 'admin'}), (req, res) => {
        lib.remove_report(req.params.id, (del_res) => {
            res.send(del_res);
        });
    });

module.exports = router;
