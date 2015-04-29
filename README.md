logbro
========

There were no good names left for logging libraries, so I chose a terrible
one instead.

![Codeship badge](https://codeship.com/projects/ec774770-ce48-0132-5c66-12a910c0e38c/status?branch=master)


### API

##### bro.trace()

Same argument signature as `console.log()` but only writes to `stdout` if
`NODE_DEBUG` contains `trace`.

##### bro.debug()

Same argument signature as `console.log()` but only writes to `stdout` if
`NODE_DEBUG` contains `trace` or `debug`.

##### bro.info()

Same argument signature as `console.log()` but only writes to `stdout` if
`NODE_DEBUG` contains `trace, `debug`, or `info`.

##### bro.warn()

Same argument signature as `console.log()` but only writes to `stdout` if
`NODE_DEBUG` contains `trace`, `debug`, `info`, or `warn`.

##### bro.error()

Same argument signature as `console.error()` but only writes to `stderr` if
`NODE_DEBUG` contains `trace`, `debug`, `info`, `warn`, or `error`.

##### bro.critical()

Same argument signature as `console.error()` but only writes to `stderr` if
`NODE_DEBUG` contains `trace`, `debug`, `info`, `warn`, `error`, or `critical`.

### Events

Each method will emit an event of the same name *if the log level is high enough*.
For example, `bro.critical('foo');` will emit a `'critical'` event whose
callback argument will be `'foo'`.

This way, applications can hook in to the logging system and respond however
they want (post to Slack, send to a logging service, etc.).

### Streaming

By default, logs are written to either `process.stdout` or `process.stderr`.

Apps can optionally overwrite `bro.stdout` and `bro.stderr` with other
instances of `stream.Writable` in order to stream logs to the filesystem,
via HTTP, to a database, etc.

### Examples

##### Logging

```js
var bro = require('logbro');

bro.critical( 'this is a %s with some %s', 'log', 'formatting' );
```

##### Event binding

```js
var bro = require('logbro');

bro.on( 'critical', function( msg ) {
  slack.notify( msg );
});
```

##### Streaming

```js
var bro = require('logbro'),
  fs = require('fs'),
  file;

file = fs.createWriteStream('./log.txt');

bro.stdout = bro.stderr = file;

bro.info('blah blah blah');
```

### Running

To enable logging, applications using `logbro` must be run with a `NODE_DEBUG`
environment variable set.

Possible values include `trace`, `debug`, `info`, `warn`, `error`, and `critical`.

Each value implicitly includes all levels above itself – so, for example, when
your app is run with `NODE_DEBUG=warn node app.js`, all `warn`, `error`, and
`critical` logs will be sent to `stdout`/`stderr`. In the same example,
`bro.info()` and `bro.debug()` would effectively be no-ops.

### Notes

The `NODE_DEBUG` environment variable can actually contain *multiple* flags,
but the one with the **lowest** priority level will win. For example,
`NODE_DEBUG=debug,info,critical node app.js` will use `debug` as the log level,
since it automatically includes the other levels.
