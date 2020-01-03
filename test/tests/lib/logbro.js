'use strict';

const fs           = require('fs');
const { Writable } = require('stream');
const path = 'lib/logbro';
const Logbro = getModule( path );
const formats = getModule('lib/formats');
const buildLogObject = getModule('lib/util/build-log-object');
const levels = getModule('lib/levels');

// Shared Logbro settings symbols
const sharedLogLevel  = Symbol.for('LOGBRO_sharedLogLevel');
const sharedLogFormat = Symbol.for('LOGBRO_sharedLogFormat');

// Symbols for private properties and methods
const logWithFormat   = Symbol.for('LOGBRO_logWithFormat');

describe( path, () => {
  // Reset the shared log level and shared log format
  beforeEach( () => {
    delete global[ sharedLogLevel ];
    delete global[ sharedLogFormat ];
  });

  describe( 'static', () => {
    describe( '.level', () => {
      it( 'should get the shared log level', () => {
        global[ sharedLogLevel ] = 'info';
        expect( Logbro.level ).to.equal('info');
      } );

      it( 'should set the shared log level', () => {
        Logbro.level = 'bad warn,critical----';
        expect( global[ sharedLogLevel ]).to.equal('warn');
      } );
    } );

    describe( '.format', () => {
      it( 'should default the shared log format to pretty', () => {
        expect( Logbro.format ).to.deep.equal( formats.pretty );
      } );

      it( 'should get the global format', () => {
        const format = log => JSON.stringify( log );
        global[ sharedLogFormat ] = format;
        expect( Logbro.format ).to.deep.equal( format );
      } );

      it( 'should set the global format', () => {
        const format = log => JSON.stringify( log );
        Logbro.format = format;
        expect( Logbro.format ).to.deep.equal( format );
      } );

      it( 'should ensure the format is valid', () => {
        assert.throws(
          () => Logbro.format = null,
          'Invalid format \'null\'. Must be string or Function'
        );
      } );
    } );
  } );

  describe( 'instance', () => {
    describe( '#constructor', () => {
      it( 'should ensure stdout is Writable', () => {
        const read = fs.createReadStream('README.md');
        assert.throws(
          () => new Logbro({ stdout: read }),
          'stdout must be Writable'
        );
      } );

      it( 'should ensure stderr is Writable', () => {
        const read = fs.createReadStream('README.md');
        assert.throws(
          () => new Logbro({ stderr: read }),
          'stderr must be Writable'
        );
      } );

      it( 'should throw on an invalid format', () => {
        assert.throws(
          () => new Logbro({ format: true }),
          'Invalid format \'true\'. Must be string or Function'
        );
      } );

      it( 'should set the format if passed', () => {
        const custom = () => 'test string';
        const logger = new Logbro({ format: custom });
        expect( logger.format({ 'test': true }) ).to.equal('test string');
      } );

      it( 'should allow a format string', () => {
        const logger = new Logbro({ format: 'json' });
        expect( logger.format({ 'test': true }) ).to.equal('{"test":true}');
      } );

      it( 'should set up correct defaults', () => {
        const logger = new Logbro();
        expect( logger.stdout ).to.deep.equal( process.stdout );
        expect( logger.stderr ).to.deep.equal( process.stderr );
        expect( logger.format ).to.deep.equal( formats.pretty );
      } );

      it( 'should not blow up if an error is emitted', () => {
        const logger = new Logbro();
        logger.emit('error');
      } );
    } );

    describe( '#format', () => {
      it( 'should allow setting the local format', () => {
        const logger = new Logbro();
        const format = () => 'test log string';
        logger.format = format;
        expect( logger.format({}) ).to.equal('test log string');
      } );

      it( 'should revert to the shared format if unset', () => {
        const logger = new Logbro();
        const local = () => 'test log string';
        const shared = () => 'test log string shared';
        Logbro.format = shared;
        logger.format = local;

        expect( logger.format({}) ).to.equal('test log string');

        logger.format = null;
        expect( logger.format({}) ).to.equal('test log string shared');
      } );
    } );

    describe( 'level', () => {
      it( 'should get the shared level', () => {
        const logger = new Logbro();
        expect( logger.level ).to.deep.equal( Logbro.level );
      } );

      it( 'should throw on set', () => {
        const logger = new Logbro();
        assert.throws( () => logger.level = 'info' );
      } );
    } );

    describe( '#log', () => {
      it( 'should alias all log levels to call #log', () => {
        const data = { some: [ 'nested', 'data' ] };
        const msg = 'This is the message';
        const args = [ 'plus', 1, 'more', 'arg' ];

        const devNull = new Writable();
        devNull._write = ( chunk, enc, next ) => next();

        for ( const level in levels ) {
          const logger = new Logbro({ stdout: devNull, stderr: devNull });
          sinon.spy( logger, 'log' );
          logger[ level ]( data, msg, ...args );
          expect( logger.log.calledWith( level, data, msg, ...args ) );
        }
      } );

      it( 'should alias all log levels .json to call #logWithFormat', () => {
        const data = { some: [ 'nested', 'data' ] };
        const msg = 'This is the message';
        const args = [ 'plus', 1, 'more', 'arg' ];

        const devNull = new Writable();
        devNull._write = ( chunk, enc, next ) => next();

        for ( const level in levels ) {
          const logger = new Logbro({ stdout: devNull, stderr: devNull });
          sinon.spy( logger, logWithFormat );
          logger[ level ].json( data, msg, ...args );
          expect(
            logger[ logWithFormat ].calledWith(
              level, formats.json, data, msg, ...args
            )
          );
        }
      } );

      it( 'should call #logWithFormat with the shared format', () => {
        const writable = new Writable();
        writable._write = ( chunk, enc, next ) => next();
        const logger = new Logbro({ stdout: writable });

        const args = [ 1, 'two', null, { four: 5, six: [ 7, '8' ] } ];
        sinon.spy( logger, logWithFormat );
        logger.log( 'info', ...args );

        expect(
          logger[ logWithFormat ].calledWith( 'info', logger.format, ...args )
        ).to.be.true;
      } );

      it( 'should call #logWithFormat with the local format', () => {
        const writable = new Writable();
        writable._write = ( chunk, enc, next ) => next();
        const logger = new Logbro({ stdout: writable });
        const localFormat = obj => obj.toString();
        logger.format = localFormat; // Set the local instance format

        const args = [ 1, 'two', null, { four: 5, six: [ 7, '8' ] } ];
        sinon.spy( logger, logWithFormat );
        logger.log( 'info', ...args );

        expect(
          logger[ logWithFormat ].calledWith( 'info', localFormat, ...args )
        ).to.be.true;
      } );
    } );
  } );

  describe( '#logWithFormat', () => {
    beforeEach( () => {
      delete this.data;
      const writable = new Writable();
      writable._write = ( chunk, enc, next ) => {
        this.data = chunk.toString();
        next();
      };

      this.opts = { stdout: writable, stderr: writable };
    });

    before( () => {
      this.date = new Date( 1578068225388 );
      this.clock = sinon.useFakeTimers( this.date );
    });

    after( () => this.clock.restore() );

    it( 'should do nothing if the level is invalid', () => {
      const logger = new Logbro( this.opts );
      expect( logger[ logWithFormat ]('badlevel') ).to.be.undefined;
      expect( this.data ).to.be.undefined;
    } );

    it( 'should do nothing with an insufficient level', () => {
      const logger = new Logbro( this.opts );
      Logbro.level = 'warn';
      expect(
        logger[ logWithFormat ]( 'info', JSON.stringify, 'message' )
      ).to.be.undefined;
      expect( this.data ).to.be.undefined;
    } );

    it( 'should log with a sufficient level and add a newline', () => {
      const logger = new Logbro( this.opts );
      Logbro.level = 'info';
      expect(
        logger[ logWithFormat ]( 'info', () => 'test', 'message' )
      ).to.be.undefined;

      expect( this.data ).to.equal('test\n');
    } );

    it( 'should use util.buildLogObject with the level and args', () => {
      const logger = new Logbro( this.opts );
      Logbro.level = 'info';

      const format = JSON.stringify;

      const args = [ 1, 'two', null, { four: 5, six: [ 7, '8' ] } ];
      logger[ logWithFormat ]( 'info', format, ...args );
      const expected = buildLogObject( 'info', args );

      expect( this.data ).to.equal( format( expected ) + '\n' );
    } );

    it( 'should emit an event with the log level and log object', () => {
      const logger = new Logbro( this.opts );
      Logbro.level = 'trace';

      let eventData;

      logger.once( 'debug', log => {
        eventData = log;
      } );

      const args = [ 1, 'two', null, { four: 5, six: [ 7, '8' ] } ];
      logger[ logWithFormat ]( 'debug', JSON.stringify, ...args );
      const expectedLog = buildLogObject( 'debug', args );

      expect( eventData ).to.deep.equal( expectedLog );
    } );
  } );
} );
