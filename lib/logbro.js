'use strict';

const EventEmitter = require('events');
const { Writable } = require('stream');
const formats      = require('./formats');
const levels       = require('./levels');
const util         = require('./util');

const DEFAULT_OPTS = {
  stdout: process.stdout,
  stderr: process.stderr,
  format: null
};

// Shared Logbro settings symbols
const sharedLogLevel  = Symbol.for('LOGBRO_sharedLogLevel');
const sharedLogFormat = Symbol.for('LOGBRO_sharedLogFormat');

// Symbols for private properties and methods
const logWithFormat   = Symbol.for('LOGBRO_logWithFormat');
const localLogFormat  = Symbol.for('LOGBRO_localLogFormat');

class Logbro extends EventEmitter {
  /**********/
  /* Static */
  /**********/

  /**
   * @type {string}
   */
  static get level() {
    return global[ sharedLogLevel ];
  }

  static set level( level ) {
    global[ sharedLogLevel ] = util.parseLevel( level );
  }

  /**
   * @type {Format}
   */
  static get format() {
    return global[ sharedLogFormat ] || formats.pretty;
  }

  static set format( format ) {
    global[ sharedLogFormat ] = util.parseFormat( format );
  }

  /************/
  /* Instance */
  /************/

  /**
   * Construct an instance of Logbro
   *
   * @param {Options} opts
   */
  constructor( opts = {} ) {
    super();
    const { stdout, stderr, format } = { ...DEFAULT_OPTS, ...opts };

    if ( !( stdout instanceof Writable ) ) {
      throw new Error('stdout must be Writable');
    }

    if ( !( stderr instanceof Writable ) ) {
      throw new Error('stderr must be Writable');
    }

    this.stdout = stdout;
    this.stderr = stderr;
    this.format = format;

    // Ignore 'error' events to avoid Node process exiting
    this.on( 'error', () => {} );

    // Setup shortcuts for each level to call this.log()
    Object.keys( levels ).forEach( level => {
      this[ level ] = this.log.bind( this, level );

      // Maintain level.json for backwards compatibility
      const logJson = this[ logWithFormat ].bind( this, level, formats.json );
      this[ level ].json = logJson;
    });
  }

  /**
   * @type {Format|null}
   */
  get format() {
    return this[ localLogFormat ] || Logbro.format;
  }

  set format( format ) {
    this[ localLogFormat ] = format ? util.parseFormat( format ) : null;
  }

  /**
   * @type {string}
   */
  get level() {
    // For now, use the shared level
    // If needed, add the option for a local level
    return Logbro.level;
  }

  set level( _ ) {
    const msg = 'Do not set the level of Logbro instance. ' +
                'Instead, set the Logbro level sharedly.';
    throw new Error( msg );
  }

  /**
   * Log the formatted level, message, and args to the appropriate stream
   *
   * @param {string} level - The level to log
   * @param {string} message - the message itself
   * @param {...any} [interpolationValues] - values to format into the message
   */
  log( level, ...args ) {
    this[ logWithFormat ]( level, this.format, ...args );
  }

  /**
   * Log the formatted level, message, and args to the appropriate stream
   *
   * @param {string} level - The level to log
   * @param {Function} format - A function to convert the Log into a string
   * @param {string} message - see log()
   * @param {...any} [interpolationValues] - see log()
   */
  [logWithFormat]( level, format, ...args ) {
    const levelValue = levels[ level ];

    // Ignore invalid or insufficient log levels
    if ( levelValue && this.level && levelValue < levels[ this.level ]) {
      return;
    }

    // Aggregate and format the log into a writable string
    const log = util.buildLogObject( level, args );
    const formattedLog = format( log );

    // Write the formatted log to the output stream. Always add a newline
    const stream = levelValue > 3 ? this.stderr : this.stdout;
    stream.write( formattedLog + '\n' );

    // Emit an event for the given level
    this.emit( level, formattedLog, log );
  }
}

module.exports = Logbro;
