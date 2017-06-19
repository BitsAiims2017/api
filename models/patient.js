const db = require('../config/db.js');

const patient_schema = new db.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    age: Number,
    reports: [ObjectId],
    open_reports: [ObjectId]
});

module.exports = db.model('Patient', patient_schema);
