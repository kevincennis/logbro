'use strict';

const path = '../..';
const Logbro = require('../../lib/logbro');
const formats = getModule('lib/formats');

describe( 'index', () => {
  beforeEach( () => {
    // Clear the require cache
    delete require.cache[ require.resolve( path ) ];
  });

  it( 'should export a default instance of Logbro', () => {
    const logger = require('../..');
    expect( logger instanceof Logbro );
  } );

  it( 'should set a "Logbro" property on the default instance', () => {
    const logger = require('../..');
    expect( logger.Logbro ).to.deep.equal( Logbro );
  } );

  it( 'should set the shared format with process.env.LOGBRO_FORMAT', () => {
    process.env.LOGBRO_FORMAT = 'json';
    require('../..');
    expect( Logbro.format ).to.deep.equal( formats.json );
  } );

  it( 'should set the shared level with process.env.NODE_DEBUG', () => {
    process.env.NODE_DEBUG = 'warn';
    require('../..');
    expect( Logbro.level ).to.deep.equal('warn');
  } );
} );
