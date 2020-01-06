'use strict';

const Logbro = require('./lib/logbro');

// Set the default global level and format
if ( process.env.NODE_DEBUG ) {
  Logbro.level = process.env.NODE_DEBUG;
}

if ( process.env.LOGBRO_FORMAT ) {
  Logbro.format = process.env.LOGBRO_FORMAT;
}

module.exports = new Logbro();
module.exports.Logbro = Logbro;
