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
