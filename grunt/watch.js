module.exports = function(grunt) {


  grunt.config('watch.release', {
      files: ['**/*.js', '!release/**/*.js', '!node_modules/**', 'node_modules/microcss/**/*.js'],
      tasks: ['pack']
  });


  grunt.loadNpmTasks('grunt-contrib-watch');
};

