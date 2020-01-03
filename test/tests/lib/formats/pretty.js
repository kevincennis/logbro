'use strict';

const path = 'lib/formats/pretty';
const formatPretty = getModule( path );

describe( path, () => {
  it( 'should return the pretty version of the log object', () => {
    const log = {
      message: 'Test message',
      timestamp: new Date().toISOString(),
      level: 'info'
    };

    expect( formatPretty( log ) ).to.equal(
      `[${ log.timestamp }] ${ log.level.toUpperCase() }: ${ log.message }`
    );
  } );

  it( 'should output an error stack an Error', () => {
    const error = new Error('test');
    const log = {
      message: 'Test message',
      timestamp: new Date().toISOString(),
      level: 'info',
      stack: error.stack
    };

    expect( formatPretty( log ) ).to.equal(
      `[${ log.timestamp }] ${ log.level.toUpperCase() }: ${ log.message }\n` +
      `${ log.stack }`
    );
  } );

  it( 'should output an empty message if it is undefined', () => {
    const log = {
      timestamp: new Date().toISOString(),
      level: 'info'
    };

    expect( formatPretty( log ) ).to.equal(
      `[${ log.timestamp }] ${ log.level.toUpperCase() }: `
    );
  } );

  it( 'should output extra props at the end', () => {
    const log = {
      message: 'is valid',
      timestamp: new Date().toISOString(),
      level: 'info',
      this: 'is',
      extra: [ '1', 2, true ]
    };

    const extra = 'this: "is"\nextra: ["1",2,true]';

    expect( formatPretty( log ) ).to.equal(
      `[${ log.timestamp }] ${ log.level.toUpperCase() }: ${ log.message }\n` +
      extra
    );
  } );
} );
