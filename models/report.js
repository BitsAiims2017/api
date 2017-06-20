const db = require('../config/db.js');

const report_schema = new db.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    symptoms: String,
    diagnosis: String,
    conclusion: String,
    remarks: String,
    diagnosed_by: [ObjectId],
    timestamps: {
        createdAt: 'created',
        updatedAt: 'updated'
    }
});

module.exports = db.model('Report', report_schema);
