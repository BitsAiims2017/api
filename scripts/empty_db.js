const util = require('../lib/test_util.js');

util.remove_all_users((done) => {
    console.log('Removed users');

    util.remove_all_items((done) => {
        console.log('Removed items');

        util.remove_all_reports((done) => {
            console.log('Removed reports');

            util.remove_all_patients((done) => {
                console.log('Removed patients');
                process.exit();
            });
        });
    });
});
