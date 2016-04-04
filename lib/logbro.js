var EventEmitter = require('events').EventEmitter,
  env = process.env.NODE_DEBUG,
  util = require('util'),
  loglevel,
  exports,
  levels;

// export EventEmitter interface
exports = module.exports = new EventEmitter();

// `error` events have special meaning in node, and unless
// a handler is bound, they'll raise an exception
exports.on( 'error', function() {} );

// set up default write streams
exports.stdout = process.stdout;
exports.stderr = process.stderr;

// log levels
levels = {
  TRACE:      0,
  DEBUG:      1,
  INFO:       2,
  WARN:       3,
  ERROR:      4,
  CRITICAL:   5
};

// set loglevel based on NODE_DEBUG env variable and
// create exported methods
function initialize() {
  var flags = [];

  Object.keys( levels ).forEach(function( type, level ) {
    var method = type.toLowerCase();
    exports[ method ] = log.bind( exports, type, level, false );
    exports[ method ].json = log.bind( exports, type, level, true );
    if ( new RegExp( '\\b' + type + '\\b', 'i' ).test( env ) ) {
      flags.push( level );
    }
  });

  loglevel = Math.min.apply( Math, flags );
}

// format log messages
function format( type, args ) {
  var now = new Date().toISOString(),
    tmpl = '[%s] %s: %s\n',
    msg;

  msg = args[ 0 ] instanceof Error ? args[ 0 ].stack :
    util.format.apply( util, args );

  return util.format( tmpl, now, type, msg );
}

// log (or no-op) based on supplied `level`
function log( type, level, json ) {
  var stream, args, msg;

  if ( level >= loglevel ) {
    args = Array.prototype.slice.call( arguments, 3 );
    msg = json === true ? args[ 0 ] : format( type, args );
    stream = level > 3 ? 'stderr' : 'stdout';
    exports[ stream ].write( msg );
    exports.emit( type.toLowerCase(), msg );
  }
}

// get things started
initialize();
