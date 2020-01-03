'use strict';

const path = 'lib/levels';
const levels = getModule( path );

describe( path, () => {
  it( 'should export an object mapping strings to numbers', () => {
    expect( levels ).to.be.instanceOf( Object );

    for ( const [ level, value ] of Object.entries( levels ) ) {
      expect( level ).to.be.a('string');
      expect( value ).to.be.a('number');
    }
  } );

  it( 'should export all expected levels', () => {
    expect( levels.trace ).to.equal( 0 );
    expect( levels.debug ).to.equal( 1 );
    expect( levels.info ).to.equal( 2 );
    expect( levels.warn ).to.equal( 3 );
    expect( levels.error ).to.equal( 4 );
    expect( levels.critical ).to.equal( 5 );
    expect( levels.off ).to.equal( Infinity );
  } );
} );
