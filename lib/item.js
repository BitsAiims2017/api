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

/**
 * Add a new item
 *
 * @param item The item to be added
 * @param done The callback with the response
 */
exports.add_item = (item, done) => {
    Item.findOne({id: item.id}, (err, exist) => {
        if (err) {
            done({status: 500, message: 'Internal error 009'});
        }
        else if(exist) {
            done({status: 409, message: 'Item already exists'});
        }
        else {
            let new_item = new Item({
                id : item.id,
                name : item.name,
                quantity : item.quantity,
                price : item.price,
                class : item.class
            });

            new_item.save((save_err) => {
                if (save_err) {
                    done({status: 500, message: 'Internal error 010'});
                } else {
                    done({status: 201, message: 'Item added'});
                }
            });
        }
    });
};

/**
 * Get all the items
 *
 * @param done The callback with error and data
 */
exports.get_all_items = (done) => {
    Item.find({}, 'id name quantity price class', (err, items) => {
        if (err) {
            done({status: 500, message: 'Internal error 011'}, null);
        } else {
            done(null, items);
        }
    });
};

/**
 * Delete an item
 *
 * @param id The id of the item to be deleetd
 * @param done The callback with response
 */
exports.remove_item = (id, done) => {
    Item.remove({id}, (err) => {
        done({status: 200, message: 'Item deleted'});
    });
};

/**
 * Update item details
 *
 * @param id The id of the item to be updated
 * @param data An object with the parameters to change
 * @param done The callback with err and response
 */
exports.update_item = (id, data, done) => {
    Item.findOne({id}, (err, item) => {
        if (err || !item) {
            done({status: 404, message: 'Item not found'}, null);
        } else {
            for (var prop in data) {
                if (item[prop]) { item[prop] = data[prop]; }
            }
            item.save((err) => {
                if (err) {
                    done({status: 500, message: 'Internal error 012'}, null);
                } else {
                    done(null, {status: 200, message: 'Item updated'});
                }
            });
        }
    });
};
