'use strict';

const path = 'lib/util/parse-level';
const parseLevel = getModule( path );
const levels = getModule('lib/levels');

describe( path, () => {
  it( 'should return "off" if no level is supplied', () => {
    expect( parseLevel() ).to.deep.equal('off');
  } );

  it( 'should return all valid levels if just the name is supplied', () => {
    for ( const level in levels ) {
      expect( parseLevel( level ) ).to.equal( level );
    }
  } );

  it( 'should return the lowest level if multiple tokens are supplied', () => {
    expect( parseLevel('off, trace, debug') ).to.equal('trace');
    expect( parseLevel('critical,info,debug,number,random') ).to.equal('debug');
    expect( parseLevel('%^&,.p-fail,-&debug.critical,raom') ).to.equal('debug');
  } );
} );
