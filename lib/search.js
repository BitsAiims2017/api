const Items = require('../models/item.js');
const Users = require('../models/user.js');

/**
 * Search for a given query in items
 *
 * @param params An object with:
 * {
 *  query: the query to search for
 *  limit: the total number of results
 * }
 * @param done The callback with response
 */
exports.search_items = (params, done) => {
    const query = new RegExp(params.query, 'i') || null;
    const limit = parseInt(params.limit) || 50;
    const sort = params.sort || '_id';
    const order = (params.order === 'desc') ? '-' : '';
    let data = {};

    Items.find({}).
        or([
            {'id': query},
            {'name': query}
        ]).
        sort(order + sort).
        limit(limit).
        exec((err, items) => {
            done({status: 200, data: items});
        });
};

/**
 * Search for a given query in users
 *
 * @param params An object with:
 * {
 *  query: the query to search for
 *  limit: the total number of results
 * }
 * @param done The callback with response
 */
exports.search_users = (params, done) => {
    const query = new RegExp(params.query, 'i') || null;
    const limit = parseInt(params.limit) || 50;
    const sort = params.sort || '_id';
    const order = (params.order === 'desc') ? '-' : '';
    let data = {};

    Users.find({}).
        or([
            {'username': query},
            {'name': query},
            {'role': query}
        ]).
        select('name username role meta').
        sort(order + sort).
        limit(limit).
        exec((err, items) => {
            done({status: 200, data: items});
        });
};
