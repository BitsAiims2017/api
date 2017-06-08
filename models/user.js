const db = require('../config_db.js');

const user_schema = new db.Schema({
    user_id: {
        type: Number,
        unique: true,
        required: true
    },
    name: String,
    role: {
        type: String,
        enum: ['admin', 'viewer'],
        required: true
    }
});

module.exports = db.model('User', user_schema);
