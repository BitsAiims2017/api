const router = require('express').Router();

// import util funtions
const lib = require('../lib/item.js');
const auth = require('../lib/auth.js');

// decode token and put data in req as 'req.data'
router.use(auth.decode_token);

router.route('/').
    get(auth.authenticate({role: 'viewer'}), (req, res) => {
        lib.get_all_items((err, data) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.send(data);
            }
        });
    }).
    post(auth.authenticate({role: 'admin'}), (req, res) => {
        lib.add_item(req.body, (add_res) => {
            res.status(add_res.status).send(add_res);
        });
    }).
    put().
    delete();

router.route('/:id').
    get(auth.authenticate({role: 'viewer'}), (req, res) => {
        lib.get_item(req.params.id, (err, item) => {
            if (err) {
                res.status(err.status).send(err);
            } else {
                res.send(item);
            }
        });
    }).
    post().
    put().
    delete(auth.authenticate({role: 'admin'}), (req, res) => {
        lib.remove_item(req.params.id, (del_res) => {
            res.send(del_res);
        });
    });

module.exports = router;
