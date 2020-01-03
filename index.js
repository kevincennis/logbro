'use strict';

const Logbro = require('./lib/logbro');

// Set the default global level and format
Logbro.level = process.env.NODE_DEBUG;
Logbro.format = process.env.LOGBRO_FORMAT;

module.exports = new Logbro();
module.exports.Logbro = Logbro;
