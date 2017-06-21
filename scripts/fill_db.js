const util = require('../lib/test_util.js');

util.add_users((done) => {
    console.log('Added users');

    util.add_items((done) => {
        console.log('Added items');

        util.add_reports((done) => {
            console.log('Added reports');

            util.add_patients((done) => {
                console.log('Added patients');
                process.exit();
            });
        });
    });
});
