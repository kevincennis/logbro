'use strict';

const { format } = require('util');
const template = '[%s] %s: %s';

/**
 * Format the log using a pretty template string
 *
 * @param {Log} log - the log object
 * @returns {string}
 */
function pretty( log ) {
  const { message = '', timestamp, level, stack } = log;

  let msg = format( template, timestamp, level.toUpperCase(), message || '' );

  if ( stack ) {
    msg += `\n${ stack }`;
  }

  return msg;
}

module.exports = pretty;
