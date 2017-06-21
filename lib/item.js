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
    Item.findOne({id}, 'id name quantity price class -_id', (err, item) => {
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
 * @param options An object with size and page for pagination
 * @param done The callback with error and data
 */
exports.get_all_items = (options, done) => {
    let size = parseInt((options.size) >= 0 ? options.size : 10);
    let page = parseInt((options.page) > 0 ? options.page : 1);
    let sort = options.sort || '_id';
    let order = (options.order === 'desc') ? -1 : 1;

    Item.
        find({}).
        select('id name quantity price class date_added -_id').
        sort({sort: order}).
        skip((page - 1) * size).
        limit(size).
        exec((err, items) => {
        if (err) {
            done({status: 500, message: 'Internal error 011'}, null);
        } else {
            let data = {
                meta: {
                    next: ( items.length === size ) ?
                    encodeURI('/items?page=' + (page + 1)) : null,
                    prev: ( page > 1 ) ?
                    encodeURI('/items?page=' + (page - 1)) : null
                },
                items
            };
            done(null, data);
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
