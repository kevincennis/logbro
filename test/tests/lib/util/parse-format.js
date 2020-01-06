'use strict';

const path = 'lib/util/parse-format';
const parseFormat = getModule( path );
const formats = getModule('lib/formats');

describe( path, () => {
  it( 'should throw if the passed format is not a string or Function', () => {
    assert.throws( () => parseFormat( true ) );
  } );

  it( 'should return valid formats for the current formats', () => {
    for ( const [ name, fn ] of Object.entries( formats ) ) {
      const format = parseFormat( name );
      expect( format ).to.deep.equal( fn );
    }
  } );

  it( 'should fail for an invalid string', () => {
    const badFormatName = Object.keys( formats ).join('-');
    assert.throws( () => parseFormat( badFormatName ) );
  } );

  it( 'should return a custom function that is passed in', () => {
    const fn = log => JSON.stringify( log );
    expect( parseFormat( fn ) ).to.deep.equal( fn );
  } );
} );
