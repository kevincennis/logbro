var chai = require('chai');

describe( 'lib/logbro', function() {

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

    [ 'info', 'debug', 'warn', 'error', 'critical' ].forEach(function( method ) {
      it( 'should export `' + method + '`', function() {
        var log = require('rewire')('../../lib/logbro');

        chai.assert.isFunction( log[ method ] );
      });
    });

    [ 'info', 'debug', 'warn', 'error', 'critical' ].forEach(function( method, i ) {
      it( 'should set `loglevel = ' + i + ' when `NODE_DEBUG` contains `' + method + '`', function() {
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

  describe( 'info', function() {

    it( 'should write to stdout when loglevel is 0', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 0 );

      log.stdout = {
        write: function( msg ) {
          chai.assert.include( msg, 'hello world' );
        }
      }

      log.info('hello world');
    });

    it( 'should emit `info`', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 0 );

      log.stdout = {
        write: function( msg ) {}
      }

      log.on( 'info', function( msg ) {
        chai.assert.include( msg, 'hello world' );
      })

      log.info('hello world');
    });

    it( 'should not write to stdout when loglevel is greater than 0', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 1 );

      log.stdout = {
        write: function( msg ) {
          chai.assert.ok( false );
        }
      }

      log.info('hello world');
      chai.assert.ok( true );
    });

  });

  describe( 'debug', function() {

    it( 'should write to stdout when loglevel is 1', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 1 );

      log.stdout = {
        write: function( msg ) {
          chai.assert.include( msg, 'hello world' );
        }
      }

      log.debug('hello world');
    });

    it( 'should emit `debug`', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 0 );

      log.stdout = {
        write: function( msg ) {}
      }

      log.on( 'debug', function( msg ) {
        chai.assert.include( msg, 'hello world' );
      })

      log.debug('hello world');
    });

    it( 'should not write to stdout when loglevel is greater than 1', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 2 );

      log.stdout = {
        write: function( msg ) {
          chai.assert.ok( false );
        }
      }

      log.debug('hello world');
      chai.assert.ok( true );
    });

  });

  describe( 'warn', function() {

    it( 'should write to stdout when loglevel is 2', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 2 );

      log.stdout = {
        write: function( msg ) {
          chai.assert.include( msg, 'hello world' );
        }
      }

      log.warn('hello world');
    });

    it( 'should emit `warn`', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 0 );

      log.stdout = {
        write: function( msg ) {}
      }

      log.on( 'warn', function( msg ) {
        chai.assert.include( msg, 'hello world' );
      })

      log.warn('hello world');
    });

    it( 'should not write to stdout when loglevel is greater than 2', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 3 );

      log.stdout = {
        write: function( msg ) {
          chai.assert.ok( false );
        }
      }

      log.warn('hello world');
      chai.assert.ok( true );
    });

  });

  describe( 'error', function() {

    it( 'should write to stderr when loglevel is 3', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 3 );

      log.stderr = {
        write: function( msg ) {
          chai.assert.include( msg, 'hello world' );
        }
      }

      log.error('hello world');
    });

    it( 'should emit `error`', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 0 );

      log.stderr = {
        write: function( msg ) {}
      }

      log.on( 'error', function( msg ) {
        chai.assert.include( msg, 'hello world' );
      })

      log.error('hello world');
    });

    it( 'should not write to stderr when loglevel is greater than 3', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 4 );

      log.stderr = {
        write: function( msg ) {
          chai.assert.ok( false );
        }
      }

      log.error('hello world');
      chai.assert.ok( true );
    });

  });

  describe( 'critical', function() {

    it( 'should write to stderr when loglevel is 4', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 4 );

      log.stderr = {
        write: function( msg ) {
          chai.assert.include( msg, 'hello world' );
        }
      }

      log.critical('hello world');
    });

    it( 'should emit `critical`', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 0 );

      log.stderr = {
        write: function( msg ) {}
      }

      log.on( 'critical', function( msg ) {
        chai.assert.include( msg, 'hello world' );
      })

      log.critical('hello world');
    });

    it( 'should not write to stderr when loglevel is greater than 4', function() {
      var log = require('rewire')('../../lib/logbro');

      log.__set__( 'loglevel', 5 );

      log.stderr = {
        write: function( msg ) {
          chai.assert.ok( false );
        }
      }

      log.critical('hello world');
      chai.assert.ok( true );
    });

  });

});
