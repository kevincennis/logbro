# logbro


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
var log = require('./log');

log.critical( 'this is a % with some %', 'log', 'formatting' );
```

##### Event binding

```js
var log = require('./log');

log.on( 'critical', function( msg ) {
  slack.notify( msg );
});
```

##### Streaming

```js
var log = require('./log'),
  fs = require('fs'),
  file;

file = fs.createWriteStream('./log.txt');

log.stdout = log.stderr = file;

log.info('blah blah blah');
```

### Notes

The `NODE_DEBUG` environment variable can actually contain *multiple* flags, but the one with the **lowest** priority level will win. For example, `NODE_DEBUG=info,debug,critical node app.js` will use `info` as the log level, since it automatically includes the other levels.
