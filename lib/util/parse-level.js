'use strict';

const levels = require('../levels');

/**
 * Parse a string into a single level with minimum level of criticality
 *
 * @param {string} levelTokens - a string of tokens represeting the level
 * @returns {string} the level that the tokens represent
 */
function parseLevel( levelTokens ) {
  // Get the levels that match the input string
  const matchedLevels = Object.keys( levels ).filter(
    level => new RegExp( '\\b' + level + '\\b', 'i' ).test( levelTokens )
  );

  // Return the level with the smallest value
  return matchedLevels.reduce( ( curr, level ) => {
    return levels[ level ] < levels[ curr ] ? level : curr;
  }, 'off' );
}

module.exports = parseLevel;
