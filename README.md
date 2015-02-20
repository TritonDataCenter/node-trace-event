node-event-tracer: A node module for creating event traces according
to [Google's Trace Event
format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU)
with the hopes of using their
[trace-viewer](https://github.com/google/trace-viewer) to grok one's programs.

TODO: quick picture example

# Current Status

Current still scratching my itch. No docs. No tests. Incomplete. Alpha.


# Install

    npm install event-tracer


# Usage

TODO

```javascript
var evt = require('event-tracer').createEventTracer();
evt.begin({name: 'myname', id: 'some-id'});
evt.end({name: 'myname', id: 'some-id'});
```

TODO: point to examples/
TODO: `child` usage


# Usage with Bunyan

TODO

Example usage with restify:

```javascript
var event_tracer = require('event-tracer');

// restify server setup ...  (TODO: include barebones version)

server.use(restify.requestLogger());    // to get `req.log` with `req_id`
server.use(function (req, res, next) {  // add `req.evt` for each request
    req.evt = event_tracer.createBunyanEventTracer({
        log: req.log
    });
    next();
});

server.get({path: '/ping', name: 'Ping'}, function (req, res, next) {
    req.evt.begin('ping');              // <--- begin trace event
    res.send({ping: 'pong'});
    req.evt.end('ping');                // <--- end trace event
    next();
});
```

TODO: show example output
TODO: tool to convert to a format that trace-viewer wants



# Longer Example

TODO



# Links

- https://github.com/google/trace-viewer/wiki
- https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU
- TODO: read https://github.com/natduca/py_trace_event
- https://github.com/google/trace-viewer


# License

MIT. See LICENSE.txt.
