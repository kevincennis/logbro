'use strict';

const path = 'lib/formats';
const formats = getModule( path );

const log = {
  message: 'Test message',
  timestamp: new Date().toISOString(),
  level: 'info'
};

describe( path, () => {
  it( 'should be an object mapping name to format function', () => {
    expect( formats ).to.be.instanceOf( Object );

    for ( const [ name, fn ] of Object.entries( formats ) ) {
      expect( name ).to.be.a('string');
      expect( fn ).to.be.a('function');
      expect( fn( log ) ).to.be.a('string');
      expect( fn.length ).to.equal( 1 );
    }
  } );

  it( 'should contain json and pretty', () => {
    expect( formats.json ).to.exist;
    expect( formats.pretty ).to.exist;
  } );
} );
