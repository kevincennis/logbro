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
  const { message = '', timestamp, level, stack, ...props } = log;

  let msg = format( template, timestamp, level.toUpperCase(), message || '' );

  if ( stack ) {
    msg += `\n${ stack }`;
  }

  if ( Object.keys( props ).length > 0 ) {
    for ( const prop in props ) {
      msg += `\n${ prop }: ${ JSON.stringify( props[ prop ]) }`;
    }
  }

  return msg;
}

module.exports = pretty;
