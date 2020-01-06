'use strict';

const util = require('util');
const path = 'lib/util/build-log-object';
const buildLogObject = getModule( path );

const level = 'info';

describe( path, () => {
  before( () => {
    this.date = new Date( 1578068225388 );
    this.clock = sinon.useFakeTimers( this.date );
  });

  after( () => this.clock.restore() );

  it( 'should return an empty message if none is supplied', () => {
    const log = buildLogObject( level, [] );
    expect( log ).to.deep.equal({
      message: '',
      timestamp: this.date.toISOString(),
      level
    });
  } );

  it( 'should build a simple message log', () => {
    const message = 'Simple log message';
    const log = buildLogObject( level, [ message ] );
    expect( log ).to.deep.equal({
      message,
      timestamp: this.date.toISOString(),
      level
    });
  } );

  it( 'use the message as a template to format interpolation values', () => {
    const message = 'Message: %s %f';
    const interpolationValues = [ 'hey', 1.1234 ];
    const log = buildLogObject( level, [ message, ...interpolationValues ] );

    expect( log ).to.deep.equal({
      message: util.format( message, ...interpolationValues ),
      timestamp: this.date.toISOString(),
      level
    });
  } );

  it( 'should serialize an error stack', () => {
    const error = new Error('Test error');
    const message = 'Message';
    const interpolationValues = [ error ];
    const args = [ message, ...interpolationValues ];
    const log = buildLogObject( level, args );

    expect( log ).to.deep.equal({
      message: util.format( message, error ),
      timestamp: this.date.toISOString(),
      level
    });
  } );

  it( 'should serialize an error stack and properties', () => {
    const error = new Error('Test error');
    error.propertyOne = 'PropNumberOne';
    error.deepObj = { deep: [ 'This is the deep message' ] };
    const message = 'Message';
    const args = [ message, error ];
    const log = buildLogObject( level, args );

    expect( log ).to.deep.equal({
      message: util.format( message, error ),
      timestamp: this.date.toISOString(),
      level
    });

    expect( log.message ).to.include('This is the deep message');
    expect( log.message ).to.include('PropNumberOne');
  } );

  it( 'should serialize an error subclass', () => {
    class ErrorSubclass extends Error {}
    const error = new ErrorSubclass('Test error');
    error.propertyOne = 'PropNumberOne';
    error.deepObj = { deep: [ 'This is the deep message' ] };
    const message = 'Message';
    const args = [ message, error ];
    const log = buildLogObject( level, args );

    expect( log ).to.deep.equal({
      message: util.format( message, error ),
      timestamp: this.date.toISOString(),
      level
    });

    expect( log.message ).to.include('This is the deep message');
    expect( log.message ).to.include('PropNumberOne');
  } );
} );
