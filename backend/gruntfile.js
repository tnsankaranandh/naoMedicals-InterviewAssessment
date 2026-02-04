module.exports = function (grunt) {
  grunt.initConfig({
    clean: ["dist"],
    uglify: {
      build: {
        files: [{
          expand: true,
          cwd: "src",
          src: "**/*.js",
          dest: "dist"
        }]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  grunt.registerTask("default", ["clean", "uglify"]);
};
