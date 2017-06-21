const db = require('../config/db.js');

const patient_schema = new db.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        name: String,
        dob: { type: Date },
        date_now: { type: Date, default: Date.now },
        gender: String,
        blood_group: String,
        reports: [String],
        open_consultation: [String]
    }
);
patient_schema.virtual('age').
    get(function() {
        return parseInt((Date.now() - Date.parse(this.dob))/31536000000);
    });

patient_schema.set('toJSON', {
    virtuals: true
});

module.exports = db.model('Patient', patient_schema);
