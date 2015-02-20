/*
 * Show that `{objectMode: true}` is available on an EventTracer
 * to get raw JSON event object output.
 */

var evt = require('../lib/event-tracer').createEventTracer({objectMode: true});
evt.on('data', function (ev) {
    console.log('EVENT (type "%s"): %j', typeof(ev), ev);
});


evt.begin({name: 'doSomething', id: 'abc'});
evt.end({name: 'doSomething', id: 'abc'});
