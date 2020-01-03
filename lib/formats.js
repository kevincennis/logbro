'use strict';

const util = require('util');

function json( log ) {
  return JSON.stringify( log ) + '\n';
}

const prettyTemplate = '[%s] %s: %s';
function pretty( log ) {
  const { timestamp, level, message, stack } = log;

  let msg = util.format(
    prettyTemplate,
    timestamp,
    level.toUpperCase(),
    message
  );

  if ( stack ) {
    msg += `\n${ stack }`;
  }

  return msg + '\n';
}

module.exports = {
  json,
  pretty
};
