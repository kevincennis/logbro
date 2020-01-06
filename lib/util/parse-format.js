'use strict';

const formats = require('../formats');

/**
 * Parse a format name string or custom function and
 * return the representative function
 *
 * @param {string|Function} format
 * @returns {Function}
 */
function parseFormat( format ) {
  if ( formats[ format ]) {
    return formats[ format ];
  }

  if ( typeof format === 'function' ) {
    return format;
  }

  throw new Error( `Invalid format '${ format }'. Must be string or Function` );
}

module.exports = parseFormat;
