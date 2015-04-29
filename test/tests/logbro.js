var chai = require('chai'),
 util = require('util'),
 LEVELS;



describe( 'lib/logbro', function() {

  LEVELS = [ 'trace', 'debug', 'info', 'warn', 'error', 'critical' ];

  describe( 'basic', function() {

    it( 'should be an EventEmitter', function() {
      var log = require('rewire')('../../lib/logbro'),
        EventEmitter = require('events').EventEmitter;

      chai.assert.instanceOf( log, EventEmitter );
    });

    it( 'should export stdout stream', function() {
      var log = require('rewire')('../../lib/logbro');

      chai.assert.equal( log.stdout, process.stdout );
    });

    it( 'should export stderr stream', function() {
      var log = require('rewire')('../../lib/logbro');

      chai.assert.equal( log.stderr, process.stderr );
    });

    it( 'should bind to `error` in order to prevent exceptions', function() {
      var log = require('rewire')('../../lib/logbro');

      chai.assert.lengthOf( log.listeners('error'), 1 );
    });

  });

  describe( 'initialize', function() {

    LEVELS.forEach(function( method ) {
      it( util.format( 'should export `%s`', method ), function() {
        var log = require('rewire')('../../lib/logbro');

        chai.assert.isFunction( log[ method ] );
      });
    });

    LEVELS.forEach(function( method, i ) {
      it( util.format( 'should set `loglevel = %d` when `NODE_DEBUG` contains `%s`', i, method ), function() {
        var log = require('rewire')('../../lib/logbro'),
          initialize = log.__get__('initialize');

        log.__set__( 'env', method );
        initialize();

        chai.assert.equal( log.__get__('loglevel'), i );
      });
    });

    it( 'should choose the lowest value in `NODE_DEBUG` as the log level', function() {
      var log = require('rewire')('../../lib/logbro'),
        initialize = log.__get__('initialize');

      log.__set__( 'env', 'debug,critical' );
      initialize();

      chai.assert.equal( log.__get__('loglevel'), 1 );
    });

  });

  describe( 'format', function() {

    it( 'should replace placeholders', function() {
      var log = require('rewire')('../../lib/logbro'),
        format = log.__get__('format'),
        str;

      str = format( 'INFO', [ 'template %s, yo', 'string' ] );
      chai.assert.include( str, 'template string, yo' );
    });

    it( 'should prepend an ISO date', function() {
      var log = require('rewire')('../../lib/logbro'),
        format = log.__get__('format'),
        re = /\[\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)\]/,
        str;

      str = format( 'INFO', [ 'some logs' ] );
      chai.assert.match( str, re )
    });

    it( 'should prepend the type', function() {
      var log = require('rewire')('../../lib/logbro'),
        format = log.__get__('format'),
        re = /\[\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)\]/,
        str;

      str = format( 'INFO', [ 'some logs' ] );
      chai.assert.match( str, /INFO:/ );
    });

    it( 'should log stack traces', function() {
      var log = require('rewire')('../../lib/logbro'),
        format = log.__get__('format'),
        obj = {},
        str;

      try {
        obj.foo();
      } catch( err ) {
        str = format( 'critical', [ err ] );
        chai.assert.include( str, err.stack );
      }
    });

  });


  LEVELS.forEach(function( method, i ) {

    describe( method, function() {

      var stream = i > 3 ? 'stderr' : 'stdout';

      it( util.format( 'should write to %s when loglevel is %d', stream, i ), function() {
        var log = require('rewire')('../../lib/logbro');

        log.__set__( 'loglevel', i );

        log[ stream ] = {
          write: function( msg ) {
            chai.assert.include( msg, 'hello world' );
          }
        }

        log[ method ]('hello world');
      });

      it( util.format( 'should emit `%s`', method ), function() {
        var log = require('rewire')('../../lib/logbro');

        log.__set__( 'loglevel', i );

        log[ stream ] = {
          write: function( msg ) {}
        }

        log.on( method, function( msg ) {
          chai.assert.include( msg, 'hello world' );
        })

        log[ method ]('hello world');
      });

      it( util.format( 'should not write to %s when loglevel is greater than %d', stream, i ), function() {
        var log = require('rewire')('../../lib/logbro');

        log.__set__( 'loglevel', i + 1 );

        log[ stream ] = {
          write: function( msg ) {
            chai.assert.ok( false );
          }
        }

        log[ method ]('hello world');
        chai.assert.ok( true );
      });

    });

  });

});
