'use strict';

/**
 * @typedef {function(Log):string} Format
 */

const json   = require('./json');
const pretty = require('./pretty');

/**
 * @type {Object.<string, Format>}
 */
module.exports = {
  json,
  pretty
};
