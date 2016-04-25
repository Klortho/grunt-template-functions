# grunt-template-functions

----
*This is not done. The basic mechanism works, but I have to implement getters
such that when templates refer to each other recursively, they are recursively
resolved. See test/Gruntfile.js.*

----

The first time I looked at Grunt template strings, I was a bit appalled, 
because, you know, JavaScript is functional, right? Shouldn't we be able to use
real functions there?

The difficult bit, though, is that these functions can reference
properties that haven't been instantiated yet. Also, they can reference each
other, recursively, and so they have to be evaluated that way, too.

This implementation was inspired by [this 
gist](https://gist.github.com/cspotcode/c333e6eedbe82f713f85).

The main change is that instead of defining a template like this:

    dest: 'dist-<%= version %>'

You'd define it like this:

    dest: t(()=> 'dist-' + c.version)

That doesn't look like an improvement, I know! But, that's the most trivial case,
and, because it's JavaScript, you can write any code you want, and return any 
kind of object.

Here's what a complete Gruntfile would look like:

```javascript
var process = require('process');
var templateFuncs = require('grunt-template-functions');

module.exports = templateFuncs(function(grunt, t, c) {

  var defaultConfig = {
    version: '1.1.1',

    copy: {
      main: {
        src: '*.js',
        dest: t(()=> `dist-${c.version}`),
      }
    }
  };

  // Resolve all the template functions:
  templateFuncs.resolve(defaultConfig);

  // The final config data is in `c`:
  grunt.initConfig(c);

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('default', ['copy']);

});
```
