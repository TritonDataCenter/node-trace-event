node-trace-event: A node library for creating trace event logs of program
execution according to [Google's Trace Event
format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU).
These logs can then be visualized with
[trace-viewer](https://github.com/google/trace-viewer) to grok one's programs.

TODO: quick picture example


# Current Status

Current still scratching my itch. No docs. No tests. Incomplete. Alpha.


# Install

    npm install trace-event


# Usage

TODO

```javascript
var trace = require('trace-event').createTracer();
trace.begin({name: 'myname', id: 'some-id'});
trace.end({name: 'myname', id: 'some-id'});
```

TODO: point to examples/
TODO: `child` usage


# Usage with Bunyan (a separate `trace`)

TODO

Example usage with restify:

```javascript
var trace_event = require('trace-event');

// restify server setup ...  (TODO: include barebones version)

server.use(restify.requestLogger());    // to get `req.log` with `req_id`
server.use(function (req, res, next) {  // add `req.trace` for each request
    req.trace = trace_event.createBunyanTracer({
        log: req.log
    });
    next();
});

server.get({path: '/ping', name: 'Ping'}, function (req, res, next) {
    req.trace.begin('ping');            // <--- begin trace event
    res.send({ping: 'pong'});
    req.trace.end('ping');              // <--- end trace event
    next();
});
```

TODO: show example using 'after' to auto do begin/end on endpoints
TODO: show example output
TODO: tool to convert to a format that trace-viewer wants


# Usage with Bunyan (tracing methods *on* the bunyan logger)

There is an alternative usage with Bunyan that adds a little sugar. This
requires bunyan >=1.3.4. Note that 'bunyan' is not a dependency of this
module (to avoid users of 'trace-event' that don't care about Bunyan having
to install it), so you'll need to:

    npm install bunyan

The sugar is that the `.begin()`, `.end()`, et al methods are on the logger
object.

```javascript
var trace_event = require('../lib/trace-event');

var log = trace_event.createBunyanLogger({
    name: 'sugar'
});

function doSomething(opts, cb) {
    var log = opts.log.child({req_id: opts.id});
    log.begin('doSomething');
    setTimeout(function () {
        // ...
        log.end('doSomething');
        cb();
    }, Math.floor(Math.random() * 2000));
}

for (var i = 0; i < 5; i++) {
    doSomething({log: log, id: String(i)}, function () {});
}
```

See "examples/buny.js" for a more complete example.




# Longer Example

TODO



# Links

- https://github.com/google/trace-viewer/wiki
- https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU
- TODO: read https://github.com/natduca/py_trace_event
- https://github.com/google/trace-viewer


# License

MIT. See LICENSE.txt.
