const sass = require('sass')
const loadGruntTasks = require("load-grunt-tasks")
const cwd = process.cwd()
const mozjpeg = require('imagemin-mozjpeg')

let config = {
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    paths: {
      styles: '',
      scripts: '',
      pages: 'html/*',
      images: 'images/*',
      fonts: 'fonts/*'
    }
  }
}

try {
  const loadConfig = require(`${cwd}/pages.config.js`)
  config = Object.assign({}, config, loadConfig)
} catch (e) {
}

// 方法配置路径转换
const translate = (type, obj, outputDir = 'temp', inputDir = 'src', control = item => item) => {
  const typePath = {
    'styles': config.build.paths.styles,
    'scripts': config.build.paths.scripts,
    'images': config.build.paths.images,
    'fonts': config.build.paths.fonts,
  }[type]
  let data = {}
  for (let i in obj) {
    data[`${config.build[outputDir]}${typePath}${i}`] = control(`${config.build[inputDir]}${typePath}${obj[i]}`)
  }
  return data
}

// cssmin 不支持通配，不知原因，网上的不顶用
const cssAddPath = arr => {
  const o = {}
  let len = arr.length
  for (let i =0; i < len; i++) {
    o[i] = {
      files: [{
        expand: true,
        cwd: `${config.build.temp}${config.build.paths.styles}`,
        dest:`${config.build.dist}${config.build.paths.styles}`,
        src: [arr[i]]
      }]
    }
  }
  return o
}

// 合并文件路径转换
const conactAddPath = obj => {
  const o = {}
  for (let i in obj) {
    o[`${config.build.temp}${i}`] = obj[i].map(item => {
      if (/^(\/)*node_module/.exec(item)) {
        item = item.replace(/^(\/)*node_module/, `${cwd}/node_module`)
      } else {
        item = config.build.temp + item
      }
      return item
    })
  }
  return o
}

module.exports = grunt => {
  grunt.initConfig({
    sass: {
      options: { // 编译选项
        sourceMap: true,
        implementation: sass // 指定编译模块
      },
      main: {
        files: [translate('styles', {
          'main.css': 'main.scss'
        })]
      }
    },
    babel: {
      options: {
        presets: ['@babel/preset-env']
      },
      main: {
        files: translate('scripts', {
          'main.js': 'main.js'
        })
      },
    },
    swigtemplates: {
      options: {
        defaultContext: {
          pageTitle: 'My Title'
        },
        templatesDir: config.build.src
      },
      production: {
        dest: config.build.temp,
        src: [`${config.build.src}${config.build.paths.pages}*.html`]
      }
    },
    useref: {
      html: `${config.build.temp}${config.build.paths.pages}*.html`,
      temp: config.build.temp
    },
    concat: {
      options: {
        separator: ";"
      },
      basic: {
        files: conactAddPath({
          // src/layouts/basic.html
          'assets/styles/vendor.css': [`/node_modules/bootstrap/dist/css/bootstrap.css`],
          'assets/styles/main.css': ['assets/styles/main.css'],
          'assets/scripts/vendor.js': ['/node_modules/jquery/dist/jquery.js', '/node_modules/popper.js/dist/umd/popper.js', '/node_modules/bootstrap/dist/js/bootstrap.js'],
          'assets/scripts/main.js': ['assets/scripts/main.js'],
        })
      }
    },
    // 通配方法不顶用, 当前只有手动配置了
    cssmin:cssAddPath([
      'main.css',
      'vendor.css',
    ]),
    uglify: {
      options: {
        mangle: {
          reserved: ['jQuery']
        }
      },
      my_target: {
        files: translate('scripts',{
          'main.js': 'main.js',
          'vendor.js': 'vendor.js',
        }, 'dist', 'temp', item => [item])
      }
    },
    htmlmin:{
      options: {
        removeComments: true, //移除注释
        removeCommentsFromCDATA: true, // 移除来自字符数据的注释
        collapseWhitespace: true, // 无用空格
        collapseBooleanAttributes: true, // 失败的布尔属性
        removeAttributeQuotes: true, // 移除属性引号      有些属性不可移走引号
        removeRedundantAttributes: true, // 移除多余的属性
        useShortDoctype: true, // 使用短的跟元素
        removeEmptyAttributes: true, // 移除空的属性
        removeOptionalTags: true // 移除可选附加标签
      },
      yasuo:{
        expand: true,
        cwd: `${config.build.temp}${config.build.paths.pages}`, 
        src: ['*.html'],
        dest: `${config.build.dist}${config.build.paths.pages}`
      }
    },
    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: config.build.src,
          src: [`${config.build.paths.images}*.{png,jpg,gif,svg}`],
          dest: config.build.dist
        }]
      }
    },
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: `${config.build.src}${config.build.paths.fonts}`,
            src: [`**`],
            dest: `${config.build.dist}${config.build.paths.fonts}`
          },
        ],
      },
    },
    clean: [config.build.dist, config.build.temp],
    browserSync: {
      bsFiles: {
        src : [
          `${config.build.temp}**`
        ]
      },
      options: {
        server: {
          watchTask: true,
          baseDir: [config.build.temp, config.build.src, './'],
          routes: {
            '/node_modules': `node_modules`,
          }
        }
      },
    },
    watch: {
      scripts: {
        files: [`${config.build.src}${config.build.paths.scripts}*.js`],
        tasks: ['babel'],
        options: {
          livereload: true
        }
      },
      css: {
        files: [`${config.build.src}${config.build.paths.styles}**`],
        tasks: ['sass'],
        options: {
          livereload: true
        }
      },
      html: {
        files: [`${config.build.src}${config.build.paths.pages}*.html`],
        tasks: ['swigtemplates'],
        options: {
          livereload: true
        }
      }
    }
  })
  // grunt.loadNpmTasks("grunt-sass") // 载入npm模块提供的任务
  loadGruntTasks(grunt) // 该模块自动加载所有grunt插件中的任务, 用以替代上述重复的写法
  grunt.registerTask('default', ['sass', 'babel', 'swigtemplates', 'watch']) // 启动项目
  grunt.registerTask('browser', ['browserSync'])
  grunt.registerTask('build',
    [
      'clean',
      'sass',
      'babel',
      'swigtemplates', // 编译swig
      'imagemin', // 压缩图片
      'copy', // 复制文件
      'concat', // 合并文件, gulp中可以用useref操作, 而这里只能手动配置合并
      'useref', // 将useref中注释文件转换为目标文件, 配合concat使用
      'cssmin', // 压缩css
      'uglify', // 压缩js
      'htmlmin' // 压缩html
    ]
  ) 
}