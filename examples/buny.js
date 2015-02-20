/*
 * Playing with a Bunyan example to see if some sugar is possible.
 */

var fs = require('fs');
var trace_event = require('../lib/trace-event');
var worker = require('./buny-worker');


var log = trace_event.createBunyanLogger({
    name: 'buny',
    level: 'debug'
});

function doSomething(opts, cb) {
    var log = opts.log.child({req_id: opts.id});
    log.begin('doSomething');
    setTimeout(function () {
        // ...
        worker.subTask({log: log}, function () {
            log.end('doSomething');
            cb();
        });
    }, Math.floor(Math.random() * 2000));
}

for (var i = 0; i < 5; i++) {
    doSomething({log: log, id: String(i)}, function () {});
}
