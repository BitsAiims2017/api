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

patient_schema.virtual('dob_obj').
    get(function() {
        let date = new Date(this.dob);
        return {
            raw: date,
            year: date.getFullYear(),
            month: date.getMonth(),
            day: date.getDate(),
            hour: date.getHours(),
            minute: date.getMinutes(),
            second: date.getSeconds()
        };
    });

patient_schema.set('toJSON', {
    virtuals: true
});

module.exports = db.model('Patient', patient_schema);
