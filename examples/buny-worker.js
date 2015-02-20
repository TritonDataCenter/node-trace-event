/*
 * Worker module for "buny.js" example.
 */

var assert = require('assert-plus');

function subTask(opts, cb) {
    assert.object(opts.log, 'opts.log');

    opts.log.begin('subTask')
    setTimeout(function () {
        // ...
        opts.log.debug('subTask blah blah');
        opts.log.end('subTask');
        cb();
    }, Math.floor(Math.random() * 2000));
}

module.exports = {
    subTask: subTask
};
