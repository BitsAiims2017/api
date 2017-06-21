const router = require('express').Router();

// import util funtions
const lib = require('../lib/item.js');
const auth = require('../lib/auth.js');
const validate = require('../lib/validate.js');

// decode token and put data in req as 'req.data'
router.use(auth.decode_token);

/**
 * @apiName AIIMS IMS
 * @apiGroup Item
 * @apiVersion 0.0.1
 */

router.route('/').
    /**
     * @apiGroup Item
     * @apiVersion 0.0.1
     *
     * @api {get} /item?params 1.1 Request all items
     * @apiParam page The page number of items
     * @apiParam size The number of items on each page
     * @apiParam sort The field to sort according to
     * @apiParam order The order to sort with 'asc' or 'desc'
     * @apiPermission admin, viewer, doctor, inventory
     *
     * @apiSuccess {Array} Items Array of all items
     *
     * @apiError 401 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    get(auth.authenticate({roles: ['viewer', 'doctor', 'inventory', 'admin']}),
    (req, res) => {
        lib.get_all_items(req.query, (err, data) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.links({
                    next: data.meta.next,
                    prev: data.meta.prev
                });
                res.send(data);
            }
        });
    }).

    /**
     * @apiGroup Item
     * @apiVersion 0.0.1
     *
     * @api {post} /item 1.2 Add a new item
     * @apiDescription This can only by used by admin to add a new item
     * @apiPermission admin, inventory
     *
     * @apiError 401 The request is not authorized
     * @apiError 409 Item already exists
     */
    post(auth.authenticate({roles: ['admin', 'inventory']}), (req, res) => {
        if(! validate.contains(req.body, ['id', 'name'])) {
            res.status(400)
                .send({error: 400, message: 'Incomplete parameters'});
        }
        else {
            lib.add_item(req.body, (add_res) => {
                res.status(add_res.status).send(add_res);
            });
        }
    }).

    /* not supported */
    put((req, res) => {
        res.status(400).send(lib.invalid_request());
    }).
    delete((req, res) => {
        res.status(400).send(lib.invalid_request());
    });

router.route('/:id').
    /**
     * @apiGroup Item
     * @apiVersion 0.0.1
     *
     * @api {get} /item/:id 2.1 Request item information
     * @apiDescription This can be used to get item details
     * @apiPermission admin, viewer, doctor, inventory
     *
     * @apiParam {String} id The id of the item
     *
     * @apiError 401 The request is not authorized
     * @apiError 403 The request is not authorized
     * @apiError 404 The item was not found
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    get(auth.authenticate({roles: ['viewer', 'doctor', 'inventory', 'admin']}),
    (req, res) => {
        lib.get_item(req.params.id, (err, item) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.send(item);
            }
        });
    }).

    /* not supported */
    post((req, res) => {
        res.status(400).send(lib.invalid_request());
    }).

    /**
     * @apiGroup Item
     * @apiVersion 0.0.1
     *
     * @api {put} /item/:id 2.2 Change item information
     *
     * @apiParam {Number} item The id of the item to be changed
     * @apiParam {Type} parameter The parameter to change
     * @apiPermission admin, inventory
     *
     * @apiError 403 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    put(auth.authenticate({roles: ['admin', 'inventory']}), (req, res) => {
        lib.update_item(req.params.id, req.body, (err, upd_res) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.send(upd_res);
            }
        });
    }).

    /**
     * @apiGroup Item
     * @apiVersion 0.0.1
     *
     * @api {delete} /item/:id 2.3 Delete item
     *
     * @apiParam {Number} id The id of item to be deleted
     * @apiPermission admin, inventory
     *
     * @apiError 403 The request is not authorized
     *
     * @apiErrorExample {json} Error:
     *  {
     *      "status": "Error status code",
     *      "message": "Error Message"
     *  }
     */
    delete(auth.authenticate({roles: ['admin', 'inventory']}), (req, res) => {
        lib.remove_item(req.params.id, (del_res) => {
            res.send(del_res);
        });
    });

module.exports = router;
