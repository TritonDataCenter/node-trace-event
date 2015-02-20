/*
 * An alternative to "buny-worker.js" that goes crazy with DRY to not
 * have to repeat 'subTask' by creating a child logger.
 */

var assert = require('assert-plus');

function subTask(opts, cb) {
    assert.object(opts.log, 'opts.log');
    var log = opts.log.child({evt: {name: 'subTask'}});

    log.begin();
    setTimeout(function () {
        // ...
        log.end();
        cb();
    }, Math.floor(Math.random() * 2000));
}


module.exports = {
    subTask: subTask
};
