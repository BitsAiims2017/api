const db = require('../config/db.js');

const report_schema = new db.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true
        },
        symptoms: String,
        diagnosis: String,
        conclusion: String,
        remark: String,
        diagnosed_by: [String],
        prescription: [{
            name: String,
            days: Number,
            times: Number,
            remark: String
        }]
    },
    {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated'
        }
    }
);

module.exports = db.model('Report', report_schema);
