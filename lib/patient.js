const Item = require('../models/item.js');
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
 * @param done The callback with err and the item
 */
exports.get_patient = (id, done) => {
};

/**
 * Add a new patient
 *
 * @param item The patient to be added
 * @param done The callback with the response
 */
exports.add_patient = (patient, done) => {
};

/**
 * Get all the patients
 *
 * @param options An object with size and page for pagination
 * @param done The callback with error and data
 */
exports.get_all_patients = (options, done) => {
};

/**
 * Delete a patient
 *
 * @param id The id of the patient to be deleetd
 * @param done The callback with response
 */
exports.remove_patient = (id, done) => {
};

/**
 * Update patient details
 *
 * @param id The id of the patient to be updated
 * @param data An object with the parameters to change
 * @param done The callback with err and response
 */
exports.update_patient = (id, data, done) => {
};
