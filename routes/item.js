const router = require('express').Router();

// import util funtions
const lib = require('../lib/item.js');
const auth = require('../lib/auth.js');

// decode token and put data in req as 'req.data'
router.use(auth.decode_token);

router.route('/').
    get().
    post().
    put().
    delete();

router.route('/:id').
    get().
    post().
    put().
    delete();
