'use strict';

const EventEmitter = require('events');
const formats      = require('./formats');
const levels       = require('./levels');
const util         = require('./util');

const DEFAULT_OPTS = {
  stdout: process.stdout,
  stderr: process.stderr,
  format: null
};

// Global Logbro settings symbols
const globalLogLevel  = Symbol.for('LOGBRO_globalLogLevel');
const globalLogFormat = Symbol.for('LOGBRO_globalLogFormat');

// Symbols for private properties and methods
const logWithFormat   = Symbol.for('LOGBRO_logWithFormat');
const localLogFormat  = Symbol.for('LOGBRO_localLogFormat');

class Logbro extends EventEmitter {
  /**************/
  /*    Class   */
  /**************/

  /**
   * @type {string}
   */
  static get level() {
    return global[ globalLogLevel ];
  }

  static set level( level ) {
    global[ globalLogLevel ] = util.parseLevel( level );
  }

  /**
   * @type {Format}
   */
  static get format() {
    return global[ globalLogFormat ];
  }

  static set format( format ) {
    global[ globalLogFormat ] = util.parseFormat( format );
  }

  /**************/
  /*  Instance  */
  /**************/

  constructor( opts = {} ) {
    super();

    const { stdout, stderr } = { ...DEFAULT_OPTS, ...opts };

    this.stdout = stdout;
    this.stderr = stderr;

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
    // For now, use the global level
    // If needed, add the option for a local level
    return Logbro.level;
  }

  set level( _ ) {
    const msg = 'Do not set the level of Logbro instance. ' +
                'Instead, set the Logbro globally.';
    throw new Error( msg );
  }

  log( level, ...args ) {
    this[ logWithFormat ]( level, this.format, ...args );
  }

  [logWithFormat]( level, format, ...args ) {
    const levelValue = levels[ level ];

    // Ignore invalid or insufficient log levels
    if ( levelValue === undefined || levelValue < levels[ this.level ]) {
      return;
    }

    // Aggregate and format the log into a writable string
    const log = util.buildLogObject( level, args );
    const formattedLog = format( log );

    // Write the formatted log to the output stream. Always add a newline
    const stream = levelValue > 3 ? this.stderr : this.stdout;
    stream.write( formattedLog + '\n' );

    // Emit an event for the given level
    this.emit( level, log );
  }
}

// Set the default global level and format
Logbro.level = process.env.NODE_DEBUG;
Logbro.format = process.env.LOGBRO_FORMAT || formats.pretty;

module.exports = new Logbro();
module.exports.Logbro = Logbro;
