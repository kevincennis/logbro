module.exports = function( grunt ) {

  grunt.initConfig({
    // read package.json
    pkg: grunt.file.readJSON('package.json'),
    // linting
    jshint: require('./build/config/jshint'),
    // style checker
    jscs: require('./build/config/jscs'),
    // mocha tests
    mocha_istanbul: require('./build/config/mocha')
  });

  // load npm plugins (all dependencies that match /^grunt/)
  require('load-grunt-tasks')( grunt );

  // load custom tasks
  grunt.loadTasks('./build/tasks');

};
