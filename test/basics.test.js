/*
 * Catch all test file for trace-event.
 */

var test = require('tape');
var trace_event = require('../lib/trace-event');



// --- Tests

test('exports', function (t) {
    t.ok(trace_event.createTracer, 'createTracer');
    t.ok(trace_event.createBunyanTracer, 'createBunyanTracer');
    t.ok(trace_event.createBunyanLogger, 'createBunyanLogger');
    t.end();
});
