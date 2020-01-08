'use strict';

/**
 * Format the log using JSON.stringify.
 *
 * @param {Log} log - the log object
 * @returns {string}
 */
function json( log ) {
  if ( typeof log.level === 'string' ) {
    log = { ...log, level: log.level.toUpperCase() };
  }

  return JSON.stringify( log );
}

module.exports = json;
