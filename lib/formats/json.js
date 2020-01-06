'use strict';

/**
 * Format the log using JSON.stringify.
 *
 * @param {Log} log - the log object
 * @returns {string}
 */
function json( log ) {
  return JSON.stringify( log );
}

module.exports = json;
