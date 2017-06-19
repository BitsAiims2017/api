const router = require('express').Router();

// import util funtions
const lib = require('../lib/patient.js');
const auth = require('../lib/auth.js');
const validate = require('../lib/validate.js');

// decode token and put data in req as 'req.data'
router.use(auth.decode_token);

/**
 * @apiName AIIMS IMS
 * @apiGroup Patient
 * @apiVersion 0.0.1
 */

router.route('/').
    /**
     * @apiGroup Patient
     * @apiVersion 0.0.1
     *
     * @api {get} /patients?params 1.1 Request all patients
     * @apiParam page The page number of patients
     * @apiParam size The number of patients on each page
     * @apiParam sort The field to sort according to
     * @apiParam order The order to sort with 'asc' or 'desc'
     *
     * @apiSuccess {Array} Items Array of all patients
     *
     * @apiError 401 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    get(auth.authenticate({role: 'viewer'}), (req, res) => {
        lib.get_all_patients(req.query, (err, data) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.send(data);
            }
        });
    }).

    /**
     * @apiGroup Patient
     * @apiVersion 0.0.1
     *
     * @api {post} /patients 1.2 Add a new patient
     * @apiDescription This can only by used by doctor to add a new patient
     * @apiPermission doctor
     *
     * @apiError 401 The request is not authorized
     * @apiError 409 Patient already exists
     */
    post(auth.authenticate({role: 'admin'}), (req, res) => {
        if(! validate.contains(req.body, ['id', 'name', 'age'])) {
            res.status(400)
                .send({error: 400, message: 'Incomplete parameters'});
        }
        else {
            lib.add_patient(req.body, (add_res) => {
                res.status(add_res.status).send(add_res);
            });
        }
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
     * @apiGroup Patient
     * @apiVersion 0.0.1
     *
     * @api {get} /patients/:id 2.1 Request patient information
     * @apiDescription This can be used to get patient details
     *
     * @apiParam {String} id The id of the patient
     *
     * @apiError 401 The request is not authorized
     * @apiError 403 The request is not authorized
     * @apiError 404 The patient was not found
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    get(auth.authenticate({role: 'viewer'}), (req, res) => {
        lib.get_patient(req.params.id, (err, patient) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.send(patient);
            }
        });
    }).

    /* not supported */
    post((req, res) => {
        res.status(400).send(lib.invalid_request());
    }).

    /**
     * @apiGroup Patient
     * @apiVersion 0.0.1
     *
     * @api {put} /patients/:id 2.2 Change patient information
     *
     * @apiParam {Number} id The id of the patient to be changed
     * @apiParam {Type} parameter(s) The parameter to change
     *
     * @apiError 403 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    put(auth.authenticate({role: 'admin'}), (req, res) => {
        lib.update_patient(req.params.id, req.body, (err, upd_res) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.send(upd_res);
            }
        });
    }).

    /**
     * @apiGroup Patient
     * @apiVersion 0.0.1
     *
     * @api {delete} /patients/:id 2.3 Delete patient
     * @apiPermission admin
     *
     * @apiParam {Number} id The id of patient to be deleted
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
        lib.remove_patient(req.params.id, (del_res) => {
            res.send(del_res);
        });
    });

module.exports = router;
