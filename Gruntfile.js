module.exports = function(grunt) {
  var path = require("path");


  console.log(path.resolve(__dirname));
  grunt.initConfig({
    pkg: require('./package.json'),
    absolute_root : path.resolve(__dirname),
    deploy_dir : 'release',
  });


  grunt.file.expand({filter:'isDirectory'}, 'grunt/**').forEach(grunt.loadTasks);
  grunt.log.writeln("Working in '%s'", grunt.config('deploy_dir'));

};