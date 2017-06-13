const db = require('../config/db.js');

const item_schema = new db.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    name: String,
    quantity: Number,
    class: String,
    price: Number
});

item_schema.methods.add_quantity = function add_quantity(qunatity, done) {
    done({success: true});
};

module.exports = db.model('Item', item_schema);
