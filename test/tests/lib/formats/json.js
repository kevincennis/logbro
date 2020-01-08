'use strict';

const path = 'lib/formats/json';
const formatJson = getModule( path );

describe( path, () => {
  it( 'should return the JSON.stringified version of the argument', () => {
    const log = {
      undefined,
      null: null,
      num: 1,
      bool: true,
      string: 'string',
      object: {
        deeply: {
          nested: {
            values: [ '1', '2', '3' ]
          }
        }
      }
    };

    expect( formatJson( log ) ).to.equal( JSON.stringify( log ) );
  } );

  it( 'should not serialize an Error', () => {
    const error =  new Error('test');
    error.level = 'info';
    expect( formatJson( error ) ).to.equal('{"level":"INFO"}');
  } );

  it( 'should uppercase the log level', () => {
    const log = {
      level: 'info',
      timestamp: new Date().toISOString(),
      message: 'Test message'
    };

    expect( formatJson( log ) ).to.equal(
      JSON.stringify({ ...log, level: log.level.toUpperCase() })
    );
  } );
} );
