'use strict';

const EventEmitter = require('events');
const util         = require('util');
const formats      = require('./formats');

const levels = {
  trace:    0,
  debug:    1,
  info:     2,
  warn:     3,
  error:    4,
  critical: 5
};

const DEFAULT_FORMAT = formats.pretty;

const DEFAULT_OPTS = {
  format: formats[process.env.LOGBRO_FORMAT] || DEFAULT_FORMAT,
  level: process.env.NODE_DEBUG, // Do not set a default for this
  stdout: process.stdout,
  stderr: process.stderr
};

class Logbro extends EventEmitter {
  constructor(opts = DEFAULT_OPTS) {
    super();

    const { format, level, stdout, stderr } = { ...DEFAULT_OPTS, ...opts };

    if (typeof format !== 'function') {
      throw new Error("'format' must be a function");
    }

    this.stdout = stdout;
    this.stderr = stderr;
    this.format = format;
    this._setLevel(level);

    // Ignore 'error' events
    this.on('error', () => {});

    // Setup shortcuts for each level to call this.log()
    Object.keys(levels).forEach(level => {
      this[level] = this.log.bind(this, level);

      // Maintain level.json for backwards compatibility
      this[level].json = this._logWithFormat.bind(this, level, 'json');
    });
  }

  log( level, ...args ) {
    this._logWithFormat(level, this.format, ...args);
  }

  _logWithFormat( level, format, ...args) {
    const levelValue = levels[level];

    // If the level is unknown or the
    if (levelValue === undefined || levelValue < this._levelValue) {
      return;
    }

    // Aggregate and format the log into a writable string
    const logObject = Logbro._createLogObject(level, args);
    const formattedLog = format(logObject);

    // Write the formatted log to the output stream and emit an event
    const stream = levelValue > 3 ? this.stderr : this.stdout;
    stream.write(formattedLog);
    this.emit(level, logObject);
  }

  static _createLogObject(level, args) {
    const base = {
      level,
      timestamp: new Date().toISOString(),
    };

    if (typeof args[0] === 'object' && args[0] !== null) {
      let [mergingObject, ...formatArgs] = args;

      // Error's are not JSON-stringifyable, so copy all properties to
      // a new merging object
      if (mergingObject instanceof Error) {
        const newMergingObject = { type: 'Error' };

        for (const property of Object.getOwnPropertyNames(mergingObject)) {
          newMergingObject[property] = mergingObject[property];
        }

        mergingObject = newMergingObject;
      }

      // If there are no formatArgs, message will be an empty string
      const message = util.format.apply(util, formatArgs);
      if (message) {
        mergingObject.message = message;
      }

      return Object.assign(mergingObject, base);
    } else {
      const message = util.format.apply(util, args) || undefined;
      return Object.assign( { message }, base);
    }
  }

  _setLevel(level) {
    const flags = [];

    Object.entries(levels).forEach(([name, value]) => {
      if ( new RegExp( '\\b' + name + '\\b', 'i' ).test( level ) ) {
        flags.push( value );
      }
    });

    this._levelValue = Math.min(...flags);
  }

  static get formats() {
    return formats;
  }
}

module.exports = new Logbro();
module.exports.Logbro = Logbro;
