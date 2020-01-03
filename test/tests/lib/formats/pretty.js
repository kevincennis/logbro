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
} );
