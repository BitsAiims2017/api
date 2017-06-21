const db = require('../config/db.js');

const patient_schema = new db.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        name: String,
        age: Number,
        reports: [String],
        open_consultation: [String]
    }
);

module.exports = db.model('Patient', patient_schema);
