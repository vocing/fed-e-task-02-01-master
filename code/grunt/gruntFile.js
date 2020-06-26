const sass = require('sass')
const loadGruntTasks = require("load-grunt-tasks")

module.exports = grunt => {
  grunt.initConfig({
    sass: {
      options: { // 编译选项
        sourceMap: true,
        implementation: sass // 指定编译模块
      },
      main: {
        files: [{
          'dist/css/main.css': 'src/scss/main.scss',  // 编译文件路径 : 源文件路径
          'dist/css/other.css': 'src/scss/other.scss',
        }]
      }
    },
    babel: {
      options: {
        presets: ['@babel/preset-env']
      },
      main: {
        files: {
          'dist/js/main.js': 'src/js/main.js',  // 编译文件路径 : 源文件路径
        }
      },
    },
    watch: {
      js: {
        files: ['src/js/**'],
        tasks: ['babel']
      },
      css: {
        files: ['src/scss/**'],
        tasks: ['sass']
      }
    }
  })
  // grunt.loadNpmTasks("grunt-sass") // 载入npm模块提供的任务
  loadGruntTasks(grunt) // 该模块自动加载所有grunt插件中的人物, 用以替代上述重复的写法
  grunt.registerTask('default', ['sass', 'babel', 'watch']) // 启动项目
}