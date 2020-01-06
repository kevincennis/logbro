'use strict';

const util = require('util');

/**
 * @typedef {Object} Log
 * @property {string} timestamp
 * @property {string} level
 * @property {string} message
 */

/**
 * Build the given level and args into a single Log object to be formatted
 *
 * @param {string} level - The level to log
 * @param {string} [message] - the message itself
 * @param {...any} [interpolationValues] - values to format into the message
 * @returns {Log}
 */
function buildLogObject( level, args ) {
  return {
    level,
    timestamp: new Date().toISOString(),
    message: util.format.apply( util, args )
  };
}

module.exports = buildLogObject;
