'use strict';

const util = require('util');
const template = '[%s] %s: %s';

/**
 * Format the log using a pretty template string
 *
 * @param {Log} log - the log object
 * @returns {string}
 */
function pretty( log ) {
  const { timestamp, level, message, stack } = log;

  let msg = util.format( template, timestamp, level.toUpperCase(), message );

  if ( stack ) {
    msg += `\n${ stack }`;
  }

  return msg + '\n';
}

module.exports = pretty;
