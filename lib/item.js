const Item = require('../models/item.js');
const auth = require('../lib/auth.js');

exports.invalid_request = () => {
    return {
        status: 400,
        message: 'Invalid request'
    };
};

/**
 * Get an item with the given ID
 *
 * @param id The ID of the item
 * @param done The callback with err and the item
 */
exports.get_item = (id, done) => {
    Item.findOne({id}, 'id name quantity price class', (err, item) => {
        if (err) {
            done({status: 500, message: 'Internal error 008'}, null);
        } else if (item) {
            done(null, item);
        } else {
            done({status: 404, message: 'Not found'}, null);
        }
    });
};
