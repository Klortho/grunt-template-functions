var process = require('process');
var templateFuncs = require('../main.js');

module.exports = templateFuncs(
  function(grunt, t, c) {

    var defaultConfig = {
      // for testing
      s: 'string',
      a: [1, 2],
      f: function() { },

      str: 'test string',
      test1: t(()=> 'test1: test3 is ' + c.test3),
      test2: t(()=> 'test2: str is ' + c.str),
      test3: t(()=> 'test3: test2 is ' + c.test2),

      version: '1.1.1',

      copy: {
        main: {
          expand: true,
          cwd: 'test/src/',
          src: '*.js',
          dest: t(()=> `test/dist-${c.version}`),
          filter: function(pathname) { 
            return pathname !== 'bad.js';
          }
        }
      }
    };

    templateFuncs.resolve(defaultConfig);
    grunt.log.ok('test1: ' + c.test1);
    grunt.log.ok('test2: ' + c.test2);
    grunt.log.ok('test3: ' + c.test3);
    grunt.initConfig(c);

    // Load the plugins that provides the tasks
    //grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['copy']);
  }
);


