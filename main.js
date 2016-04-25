var traverse = require('traverse');

// Class that identifies template functions
function TemplateFunction(f) {
  this.f = f;
};

// TemplateFunction factory. This is used in the grunt configs.
function template(f) {
  return new TemplateFunction(f);
};

var config = {};  // initialized when resolve() is called

// Call this after all the initial configuration has been constructed, and
// before grunt.initConfig().
function resolve(obj) {
  // Copy the object into config
  traverse(obj).map(function(x) {
    if (this.level === 1) {
      config[this.key] = x;
      this.update(null, true);
    }
  });

  traverse(config).forEach(function (x) {
    if (x instanceof TemplateFunction) {
      this.update(x.f()); 
    }
  });
};

// Export a function that gets called when Gruntfile.js is being imported.
// The return value is the export of Gruntfile.js, and is the function that 
// Grunt calls. That immediately calls the "body" of Gruntfile, putting a 
// few new variables in scope.
var templateFuncs = module.exports = function(gruntfileFunc) {
  return function(grunt) {
    gruntfileFunc(grunt, template, config);
  };
};

// Set some properties of the exported object
var self = templateFuncs;
self.TemplateFunction = TemplateFunction;
self.template = template;
self.config = config;
self.resolve = resolve;

