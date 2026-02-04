module.exports = function (grunt) {
  grunt.initConfig({
    clean: ["build"],
    uglify: {
      build: {
        files: [{
          expand: true,
          cwd: "src",
          src: "**/*.js",
          dest: "build"
        }]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.registerTask("default", ["clean", "uglify"]);
};
