# logbro &middot; ![Codeship badge](https://codeship.com/projects/ec774770-ce48-0132-5c66-12a910c0e38c/status?branch=master)

There were no good names left for logging libraries, so I chose a terrible
one instead.


```js
const bro = require('logbro');
bro.warn('I have a terrible name, but I make pretty logs');
```

## Features

- Pretty (default), JSON, and custom formats
- Configurable `stdout` and `stderr` streams
- Singleton by default
- Shared or local format and level
- `Error` stack serialization

## Levels

**stdout**
- `trace`
- `debug`
- `info`

**stderr**
- `warn`
- `error`
- `critical`

Each value implicitly includes all levels above itself – so, for example, when
your app is run with `NODE_DEBUG=warn node app.js`, all `warn`, `error`, and
`critical` logs will be sent to `stdout`/`stderr`. In the same example,
`bro.info()` and `bro.debug()` would effectively be no-ops.

## API

#### `bro.log(level, [mergingObject], [message], [...interpolationValues])`
- `level` (string): one of the levels defined above
- `[mergingObject]` (Object): an optional object to merge with the top level of the log. E.g. An `Error` object or other metadata.
- `[message]` (string): an optional message. If the message is a format string, it will use the `interpolationValues` as the format parameters. This `message` will overwrite a `message` property provided by a `mergingObject`.
- `[...interpolationValues]` (...any): optional values to use to format the `message` if it is a format string. Otherwise, these values will be appended to the `message`.

#### `bro.<level>([mergingObject], [message], [interpolationValues])`

The same as `bro.log`, but without the need to pass the `level` as a parameter. Prefer using these to `bro.log`.

#### `bro.format` (Log => string)

Get the current log format **OR** set the current log format for this `bro` instance. By default, a `bro` instance will use the shared log format. Set `bro.format = null` to resume using the shared log format.

`Log`:
- `timestamp` (string)
- `level` (string)
- `message` (string | undefined)
- The rest of the properties will be copied from the `mergingObject`


#### `Logbro.level` (string)

Get the shared log level **OR** set the shared log level.

#### `Logbro.format` (Log => string)

Get the shared log format **OR** set the shared log format.

#### `new Logbro(opts)`

##### `opts`
- `[format]` (string | (Log => string))
- `[stdout]` (stream.Writable)
- `[stderr]` (stream.Writable)


##### Example
```js
bro.log('info', 'This is an info log');

// Preferred
bro.info('This is another info log');
```

**NOTE**: `bro.log` has the same argument signature as `console.log` if the `mergingObject` is omitted.

### Configuration

#### Log Level

`logbro` will read the initial log level from the `NODE_DEBUG` environment variable.

The `NODE_DEBUG` environment variable can actually contain *multiple* flags,
but the one with the **lowest** priority level will win. For example,
`NODE_DEBUG=debug,info,critical node app.js` will use `debug` as the log level,
since it automatically includes the other levels.

**NOTE**: If the log level is not set, `logbro` will not write any logs.

#### Log Format

`logbro` will read the initial log format from the `LOGBRO_FORMAT` environment variable.

Possible formats:
- `pretty`
- `json`

### Events

Each log level will emit an event of the same name *if the log level is high enough*.
For example, `bro.critical('foo');` will emit a `'critical'` event whose
callback argument will be of type `Log`.

This way, applications can hook in to the logging system and respond however
they want (post to Slack, send to a logging service, etc.).

### Streaming

By default, logs are written to either `process.stdout` or `process.stderr`.

Apps can optionally overwrite `bro.stdout` and `bro.stderr` with other
instances of `stream.Writable` in order to stream logs to the filesystem,
via HTTP, to a database, etc.

### Node.js Compatibility

`logbro` requires >= Node.js 8.3.

### Examples

##### Logging

```js
const bro = require('logbro');

bro.critical( 'this is a %s with some %s', 'log', 'formatting' );
```

##### Event binding

```js
const bro = require('logbro');

bro.on( 'critical', msg => slack.notify( msg ) );
bro.on( 'error', (msg, log) => {
  slack.notify(msg);
  console.error(log.stack);
})
```

##### Streaming

```js
const bro = require('logbro'),
const fs  = require('fs'),

const file = fs.createWriteStream('./log.txt');
bro.stdout = file;
bro.stderr = file;

bro.info('blah blah blah');
```

##### Custom Logbro Instance

```js
const { Logbro } = require('logbro')
const format = log => '>> ' + log.message || 'No message';

const logger = new Logbro({ format });
logger.info('Hello world'); // ">> Hello world"
```
