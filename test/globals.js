const chai  = require('chai');
const sinon = require('sinon');

global.expect = chai.expect;
global.assert = chai.assert;
global.sinon  = sinon;
global.getModule = path => require( `../${ path }` );
