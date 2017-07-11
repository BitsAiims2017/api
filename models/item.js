const db = require('../config/db.js');
const User = require('./user.js');

const item_schema = new db.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    quantity: Number,
    categories: String,
    price: Number,
    date_added: { type: Date, default: Date.now }
});

item_schema.methods.add_quantity = function add_quantity(qunatity, done) {
    done({success: true});
};

module.exports = db.model('Item', item_schema);
