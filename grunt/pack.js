
module.exports = function(grunt) {
  var manifest = grunt.config.get('manifest')


  grunt.config('browserify', {
    options : {

      browserifyOptions : {
        browserField  : false,
        builtins      : false,
        commondir     : false,
        detectGlobals : false,
      },
    },

    pack : {
      files: {
        'public/_main.js': ['public/main.js'],
      }
    }
  });

  grunt.registerTask('pack', ['browserify']);
  grunt.loadNpmTasks('grunt-browserify');

};

