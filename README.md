logbro
========

There were no good names left for logging libraries, so I chose a terrible one instead.

![Codeship badge](https://codeship.com/projects/ec774770-ce48-0132-5c66-12a910c0e38c/status?branch=master)


### API

##### log.info()

Same argument signature as `console.log()` but only writes to `stdout` if `NODE_DEBUG` contains `info`.

##### log.debug()

Same argument signature as `console.log()` but only writes to `stdout` if `NODE_DEBUG` contains `info` or `debug`.

##### log.warn()

Same argument signature as `console.log()` but only writes to `stdout` if `NODE_DEBUG` contains `info`, `debug`, or `warn`.

##### log.error()

Same argument signature as `console.error()` but only writes to `stderr` if `NODE_DEBUG` contains `info`, `debug`, `warn`, or `error`.

##### log.critical()

Same argument signature as `console.error()` but only writes to `stderr` if `NODE_DEBUG` contains `info`, `debug`, `warn`, `error`, or `critical`.

### Events

Each method will emit an event of the same name *if the log level is high enough*. For example, `log.critical('foo');` will emit a `'critical'` event whose callback argument will be `'foo'`.

This way, applications can hook in to the logging system and respond however they want (post to Slack, send to a logging service, etc.).

### Streaming

By default, logs are written to either `process.stdout` or `process.stderr`.

Apps can optionally overwrite `log.stdout` and `log.stderr` with other instances of `stream.Writable` in order to stream logs to the filesystem, via HTTP, to a database, etc.

### Examples

##### Logging

```js
var log = require('logbro');

log.critical( 'this is a % with some %', 'log', 'formatting' );
```

##### Event binding

```js
var log = require('logbro');

log.on( 'critical', function( msg ) {
  slack.notify( msg );
});
```

##### Streaming

```js
var log = require('logbro'),
  fs = require('fs'),
  file;

file = fs.createWriteStream('./log.txt');

log.stdout = log.stderr = file;

log.info('blah blah blah');
```

### Running

To enable logging, applications using `logbro` must be run with a `NODE_DEBUG`
environment variable set.

Possible values include `info`, `debug`, `warn`, `error`, and `critical`.

Each value implicitly includes all levels above itself – so, for example, when
your app is run with `NODE_DEBUG=warn node app.js`, all `warn`, `error`, and
`critical` logs will be sent to `stdout`/`stderr`. In the same example,
`log.info()` and `log.debug()` would effectively be no-ops.

### Notes

The `NODE_DEBUG` environment variable can actually contain *multiple* flags,
but the one with the **lowest** priority level will win. For example,
`NODE_DEBUG=info,debug,critical node app.js` will use `info` as the log level,
since it automatically includes the other levels.
