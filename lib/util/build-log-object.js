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
 * @param {Object} [mergingObject] - all proprerties will be copied to the log
 * @param {string} [message] - the message itself
 * @param {...any} [interpolationValues] - values to format into the message
 * @returns {Log}
 */
function buildLogObject( level, args ) {
  const base = {
    level,
    timestamp: new Date().toISOString()
  };

  if ( typeof args[ 0 ] === 'object' && args[ 0 ] !== null ) {
    let [ mergingObject, ...formatArgs ] = args;

    // Error's are not JSON-stringifyable, so copy all properties to
    // a new merging object
    if ( mergingObject instanceof Error ) {
      const newMergingObject = { type: 'Error' };

      for ( const property of Object.getOwnPropertyNames( mergingObject ) ) {
        newMergingObject[ property ] = mergingObject[ property ];
      }

      mergingObject = newMergingObject;
    }

    // If there are no formatArgs, message will be an empty string
    const message = util.format.apply( util, formatArgs );
    if ( message ) {
      mergingObject.message = message;
    }

    return Object.assign( mergingObject, base );
  } else {
    const message = util.format.apply( util, args ) || undefined;
    return Object.assign( { message }, base );
  }
}

module.exports = buildLogObject;
