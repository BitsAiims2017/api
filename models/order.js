const db = require('../config/db.js');

const order_schema = new db.Schema({
    order_id: {
        type: String,
        required: true,
        unique: true
    },
    added_by: {
        type: ObjectId,
        required: true
    },
    items: [ObjectId],
    total_price: Number,
    date_added: {
        type: Date,
        default: Date.now
    },
    pending: {
        type: Boolean,
        default: true
    }
});

module.exports = db.model('Order', order_schema);
