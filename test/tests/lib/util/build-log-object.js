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

  it( 'should not return a message if none is supplied', () => {
    const log = buildLogObject( level, [] );
    expect( log ).to.deep.equal({
      message: undefined,
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

  it( 'should add the properties of the first object to the log', () => {
    const obj = { string: 'string', obj: { bool: true } };
    const log = buildLogObject( level, [ obj ] );

    expect( log ).to.deep.equal({
      timestamp: this.date.toISOString(),
      level,
      ...obj
    });
  } );

  it( 'should allow merging object and message', () => {
    const obj = { string: 'string', obj: { bool: true } };
    const message = 'Simple log message';
    const log = buildLogObject( level, [ obj, message ] );

    expect( log ).to.deep.equal({
      message,
      timestamp: this.date.toISOString(),
      level,
      ...obj
    });
  } );

  it( 'should allow merging object and message template', () => {
    const obj = { string: 'string', obj: { bool: true } };
    const message = 'Message: %s %f';
    const interpolationValues = [ 'hey', 1.1234 ];
    const args = [ obj, message, ...interpolationValues ];
    const log = buildLogObject( level, args );

    expect( log ).to.deep.equal({
      message: util.format( message, ...interpolationValues ),
      timestamp: this.date.toISOString(),
      level,
      ...obj
    });
  } );

  it( 'should serialize an error stack', () => {
    const error = new Error('Test error');
    const message = 'Message: %s %f';
    const interpolationValues = [ 'hey', 1.1234 ];
    const args = [ error, message, ...interpolationValues ];
    const log = buildLogObject( level, args );

    expect( log ).to.deep.equal({
      stack: error.stack,
      message: util.format( message, ...interpolationValues ),
      timestamp: this.date.toISOString(),
      level
    });
  } );

  it( 'should serialize an error stack and properties', () => {
    const error = new Error('Test error');
    error.propertyOne = 'one';
    error.deepObj = { deep: [ 'Object' ] };
    const message = 'Message: %s %f';
    const interpolationValues = [ 'hey', 1.1234 ];
    const args = [ error, message, ...interpolationValues ];
    const log = buildLogObject( level, args );

    expect( log ).to.deep.equal({
      stack: error.stack,
      message: util.format( message, ...interpolationValues ),
      timestamp: this.date.toISOString(),
      level,

      // Error properties
      propertyOne: 'one',
      deepObj: { deep: [ 'Object' ] }
    });
  } );

  it( 'should serialize an error subclass', () => {
    class ErrorSubclass extends Error {}
    const error = new ErrorSubclass('Test error');
    error.propertyOne = 'one';
    error.deepObj = { deep: [ 'Object' ] };
    const message = 'Message: %s %f';
    const interpolationValues = [ 'hey', 1.1234 ];
    const args = [ error, message, ...interpolationValues ];
    const log = buildLogObject( level, args );

    expect( log ).to.deep.equal({
      stack: error.stack,
      message: util.format( message, ...interpolationValues ),
      timestamp: this.date.toISOString(),
      level,

      // Error properties
      propertyOne: 'one',
      deepObj: { deep: [ 'Object' ] }
    });
  } );
} );
