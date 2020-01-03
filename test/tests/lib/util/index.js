'use strict';

const path = 'lib/util';
const util = getModule( path );

describe( path, () => {
  it( 'should export the proper utilities', () => {
    const buildLogObject = getModule('lib/util/build-log-object');
    expect( util.buildLogObject ).to.deep.equal( buildLogObject );

    const parseFormat = getModule('lib/util/parse-format');
    expect( util.parseFormat ).to.deep.equal( parseFormat );

    const parseLevel = getModule('lib/util/parse-level');
    expect( util.parseLevel ).to.deep.equal( parseLevel );
  } );
} );
