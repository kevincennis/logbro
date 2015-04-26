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
  INFO:       0,
  DEBUG:      1,
  WARN:       2,
  ERROR:      3,
  CRITICAL:   4
};

// set loglevel based on NODE_DEBUG env variable and
// create exported methods
function initialize() {
  var flags = [];

  Object.keys( levels ).forEach(function( type, level ) {
    exports[ type.toLowerCase() ] = log.bind( exports, type, level );
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
function log( type, level ) {
  var stream, args, msg;

  if ( level >= loglevel ) {
    args = Array.prototype.slice.call( arguments, 2 );
    msg = format( type, args );
    stream = level > 2 ? 'stderr' : 'stdout';
    exports[ stream ].write( msg );
    exports.emit( type.toLowerCase(), msg );
  }
}

// get things started
initialize();
