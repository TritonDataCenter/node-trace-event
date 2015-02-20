/**
 * trace-event - A library to create a trace of your node app per
 * Google's Trace Event format:
 * // JSSTYLED
 *      https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU
 */

var assert = require('assert-plus');
//var events = require('events');
var stream = require('stream');
var util = require('util');


// ---- globals

var p = console.log;

var DEBUG = true;
if (DEBUG) {
    var debug = console.warn;
} else {
    var debug = function () {};
}



// ---- internal support stuff

/**
 * Copies over all keys in `from` to `to`, or
 * to a new object if `to` is not given.
 */
function objCopy(from, to) {
    if (to === undefined) {
        to = {};
    }
    for (var k in from) {
        to[k] = from[k];
    }
    return to;
}

function evCommon() {
    var hrtime = process.hrtime(); // [seconds, nanoseconds]
    var ts = hrtime[0] * 1000000 + Math.round(hrtime[1]/1000); // microseconds
    return {
        ts: ts,
        pid: process.pid,
        tid: process.pid    // no meaningful tid for node.js
    };
}


// ---- Tracer

function Tracer(opts) {
    if (!opts) {
        opts = {};
    }
    assert.object(opts, 'opts');
    assert.optionalObject(opts.parent, 'opts.parent');
    assert.optionalObject(opts.fields, 'opts.fields');
    assert.optionalBool(opts.objectMode, 'opts.objectMode');

    this.parent = opts.parent;

    this.fields = opts.fields || {};
    if (this.parent) {
        this.fields = objCopy(opts.parent.fields);
    } else {
        this.fields = {};
    }
    if (opts.fields) {
        objCopy(opts.fields, this.fields);
    }
    if (!this.fields.cat) {
        // trace-viewer *requires* `cat`, so let's have a fallback.
        this.fields.cat = 'default';
    } else if (Array.isArray(this.fields.cat)) {
        this.fields.cat = this.fields.cat.join(',');
    }
    if (!this.fields.args) {
        // trace-viewer *requires* `args`, so let's have a fallback.
        this.fields.args = {};
    }

    if (this.parent) {
        // TODO: Not calling Readable ctor here. Does that cause probs?
        //      Probably if trying to pipe from the child.
        //      Might want a serpate TracerChild class for these guys.
        this._push = this.parent._push.bind(this.parent);
    } else {
        this._objectMode = Boolean(opts.objectMode);
        var streamOpts = {objectMode: this._objectMode};
        if (this._objectMode) {
            this._push = this.push;
        } else {
            this._push = this._pushString;
            streamOpts.encoding = 'utf8';
        }

        stream.Readable.call(this, streamOpts);
    }
}
util.inherits(Tracer, stream.Readable);

Tracer.prototype._read = function _read(size) {};

Tracer.prototype._pushString = function _pushString(ev) {
    if (!this.firstPush) {
        this.push('[')
        this.firstPush = true;
    }
    this.push(JSON.stringify(ev, 'utf8') + ',\n', 'utf8');
};

// TODO Perhaps figure out getting a trailing ']' without ',]' if helpful.
//Tracer.prototype._flush = function _flush() {
//    if (!this._objectMode) {
//        this.push(']')
//    }
//};

Tracer.prototype.child = function child(fields) {
    return new Tracer({
        parent: this,
        fields: fields
    });
};

function mkEventFunc(ph) {
    return function () {
        var fields = arguments[0];
        var ev = evCommon();
        ev.ph = ph;
        for (k in this.fields) {
            ev[k] = this.fields[k];
        }
        if (fields) {
            // TODO: faster to duck type check with `fields.substring`?
            if (typeof (fields) === 'string') {
                ev.name = fields;
            } else {
                for (k in fields) {
                    ev[k] = fields[k];
                }
                if (fields.cat) {
                    ev.cat = fields.cat.join(',');
                }
            }
        }
        this._push(ev);
    };
}

/*
 * These correspond to the "Async events" in the Trace Events doc.
 *
 * Required fields:
 * - name
 * - id
 *
 * Optional fields:
 * - cat (array)
 * - args (object)
 * - TODO: stack fields, other optional fields?
 *
 * Dev Note: We don't explicitly assert that correct fields are
 * used for speed (premature optimization alert!).
 */
Tracer.prototype.begin = mkEventFunc('b');
Tracer.prototype.instant = mkEventFunc('n');
Tracer.prototype.end = mkEventFunc('e');



// ---- BunyanTracer

function BunyanTracer(opts) {
    assert.object(opts, 'opts');
    assert.object(opts.log, 'opts.log');
    assert.optionalObject(opts.fields, 'opts.fields');

    this.log = opts.log;
    this.fields = opts.fields ? objCopy(opts.fields) : {};
    if (this.fields.cat && Array.isArray(this.fields.cat)) {
        this.fields.cat = this.fields.cat.join(',');
    }
}

function mkBunyanEventFunc(ph) {
    return function () {
        var fields = arguments[0];
        var ev = objCopy(this.fields, {ph: ph});
        if (fields) {
            // TODO: faster to duck type check with `fields.substring`?
            if (typeof (fields) === 'string') {
                ev.name = fields;
            } else {
                for (k in fields) {
                    ev[k] = fields[k];
                }
                if (fields.cat) {
                    ev.cat = fields.cat.join(',');
                }
            }
        }
        this.log.info({evt: ev});
    };
}

/*
 * These correspond to the "Async events" in the Trace Event format spec.
 */
BunyanTracer.prototype.begin = mkBunyanEventFunc('b');
BunyanTracer.prototype.instant = mkBunyanEventFunc('n');
BunyanTracer.prototype.end = mkBunyanEventFunc('e');



// ---- exports

function createTracer(opts) {
    return new Tracer(opts);
}

function createBunyanTracer(opts) {
    return new BunyanTracer(opts);
}

module.exports = {
    createTracer: createTracer,
    createBunyanTracer: createBunyanTracer
};

// vim: set ts=4 sts=4 sw=4 et:
