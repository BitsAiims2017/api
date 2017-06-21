const Patient = require('../models/patient.js');
const auth = require('../lib/auth.js');

exports.invalid_request = () => {
    return {
        status: 400,
        message: 'Invalid request'
    };
};

/**
 * Get a patient with the given ID
 *
 * @param id The ID of the patient
 * @param done The callback with err and the patient
 */
exports.get_patient = (id, done) => {
    Patient.findOne({id},
        'id name dob age gender blood_group open_consultation reports',
        (err, patient) => {
            if (err) {
                done({status: 500, message: 'Internal error 018'}, null);
            } else if (patient) {
                done(null, patient);
            } else {
                done({status: 404, message: 'Not found'}, null);
            }
        });
};

/**
 * Add a new patient
 *
 * @param patient The patient to be added
 * @param done The callback with the response
 */
exports.add_patient = (patient, done) => {
    Patient.findOne({id: patient.id}, (err, exist) => {
        if (err) {
            done({status: 500, message: 'Internal error 019'});
        }
        else if(exist) {
            done({status: 409, message: 'Patient already exists'});
        }
        else {
            let new_patient = new Patient({
                id: patient.id,
                name: patient.name,
                dob: patient.dob,
                gender: patient.gender,
                blood_group: patient.blood_group,
                '$pushAll': { open_consultation: patient.open_consultation },
                '$pushAll': { reports: patient.reports }
            });

            new_patient.save((save_err) => {
                if (save_err) {
                    done({status: 500, message: 'Internal error 015'});
                } else {
                    done({status: 201, message: 'Patient added'});
                }
            });
        }
    });
};

/**
 * Get all the patients
 *
 * @param options An object with size and page for pagination
 * @param done The callback with error and data
 */
exports.get_all_patients = (options, done) => {
    let size = parseInt((options.size) >= 0 ? options.size : 10);
    let page = parseInt((options.page) > 0 ? options.page : 1);
    let sort = options.sort || '_id';
    let order = (options.order === 'desc') ? -1 : 1;

    Patient.
        find({}).
        select('id name dob age gender blood_group open_consultation reports').
        sort({sort: order}).
        skip((page - 1) * size).
        limit(size).
        exec((err, patients) => {
            if (err) {
                done({status: 500, message: 'Internal error 020'}, null);
            } else {
                let data = {
                    meta: {
                        next: ( patients.length === size ) ?
                        encodeURI('/patients?page=' + (page + 1)) : null,
                        prev: ( page > 1 ) ?
                        encodeURI('/patients?page=' + (page - 1)) : null
                    },
                    patients
                };
                done(null, data);
            }
        });
};

/**
 * Delete an patient
 *
 * @param id The id of the patient to be deleted.
 * @param done The callback with response
 */
exports.remove_patient = (id, done) => {
    Patient.remove({id}, (err) => {
        done({status: 200, message: 'Patient deleted'});
    });
};

/**
 * Update patient details
 *
 * @param id The id of the patient to be updated
 * @param data An object with the parameters to change
 * @param done The callback with err and response
 */
exports.update_patient = (id, data, done) => {
    Patient.findOne({id}, (err, patient) => {
        if (err || !patient) {
            done({status: 404, message: 'Patient not found'}, null);
        } else {
            for (var prop in data) {
                if (patient[prop]) { patient[prop] = data[prop]; }
            }
            patient.save((err) => {
                if (err) {
                    done({status: 500, message: 'Internal error 021'}, null);
                } else {
                    done(null, {status: 200, message: 'Patient updated'});
                }
            });
        }
    });
};
