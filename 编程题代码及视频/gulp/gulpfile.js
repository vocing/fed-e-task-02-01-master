// 实现这个项目的构建任务
const {
  src,
  dest,
  series,
  parallel,
  watch
} = require('gulp')

const plugins = require('gulp-load-plugins')()
const cwd = process.cwd()
const {
  sass,
  babel,
  swig,
  imagemin,
  useref,
  htmlmin,
  uglify,
  cleanCss,
  eslint,
  ssh,
  deployFtp
} = plugins

const del = require('del')
const browserSync = require("browser-sync")
const bs = browserSync.create()

let config = {
  build: {
    src: 'src',
    dist: 'dist',
    temp: 'temp',
    public: 'public',
    paths: {
      styles: 'style/**.scss',
      scripts: 'js/**.js',
      pages: 'html/**.html',
      images: 'images/**',
      fonts: 'fonts/**'
    }
  },
  ssh: {
    test: {
      host: '192.168.31.227',
      port: 8822,
      username: 'root',
      password: 'a1234567',
    },
    production: {
      host: '192.168.31.227',
      port: 8822,
      username: 'root',
      password: 'a1234567',
    }
  }
}
try {
  const loadConfig = require(`${cwd}/pages.config.js`)
  config = Object.assign({}, config, loadConfig)
} catch (e) {
}

const styles = () => {
  return src(config.build.paths.styles, { base: config.build.src, cwd: config.build.src })
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(dest(config.build.temp))
}

const scripts = () => {
  return src(config.build.paths.scripts, { base: config.build.src, cwd: config.build.src })
    .pipe(babel({ presets: [require('@babel/preset-env')] }))
    .pipe(dest(config.build.temp))
}

const pages = async () => {
  return src(config.build.paths.pages, { base: config.build.src, cwd: config.build.src })
      .pipe(swig({defaults: { cache: false }})) // 避免缓存, 不加此项会导致启用监听后执行此任务, 只会执行一次
      .pipe(dest(config.build.temp))
}

const images = () => {
  return src(config.build.paths.images, { base: config.build.src, cwd: config.build.src })
    .pipe(imagemin())
    .pipe(dest(config.build.dist))
}

const fonts = () => {
  return src(config.build.paths.fonts, { base: config.build.src, cwd: config.build.src })
    .pipe(imagemin())
    .pipe(dest(config.build.dist))
}

const extra = () => {
  return src("**", { base: config.build.public, cwd: config.build.public })
    .pipe(dest(config.build.dist))
}

const clean = () => {
  return del([config.build.dist, config.build.temp])
}

const userefs = () => {
  return src(`${config.build.temp}/**`, { base: config.build.temp })
    .pipe(useref({ searchPath: [config.build.temp, '.']}))
    .pipe(plugins.if(/\.js$/, uglify()))
    .pipe(plugins.if(/\.html$/, htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true
    })))
    .pipe(plugins.if(/\.css$/, cleanCss()))
    .pipe(dest(config.build.dist))
}

const serve = () => {
  watch(config.build.paths.styles, { cwd: config.build.src}, styles)
  watch(config.build.paths.scripts, { cwd: config.build.src}, scripts)
  watch(config.build.paths.pages, { cwd: config.build.src}, () => {
    pages();
    return Promise.resolve()
  })
  // 此处增加浏览器的监听, 会导致资源编译很慢
  watch([
    config.build.paths.images,
    config.build.paths.fonts
  ], { cwd: config.build.src}, () => {
    bs.reload()
    return Promise.resolve()
  })
  watch('**', { cwd: config.build.public }, () => {
    bs.reload()
    return Promise.resolve()
  })
  bs.init({
    notify: false,
    port: 3000,
    files: 'temp/**',
    server: {
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules',
      }
    }
  })
}

const compile = parallel(styles, scripts, pages)

const build = series(
  clean,
  parallel(
    series(compile, userefs),
    extra,
    images,
    fonts
  )
)

const start = series(compile, serve)

const lint = () => {
  return src([`${config.build.temp}/${config.build.paths.scripts}`])
    .pipe(eslint({
      globals: [
        'jQuery',
        '$'
      ],
      envs: [
        'browser'
      ]
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// 解析argv
const parseArgv = () => {
  const argv = process.argv
  const obj = {}
  const len = argv.length
  const checkArgus = str => {
    return /^\-\-/.exec(str)
  }
  for (let i = 0; i < len; i++) {
    if (checkArgus(argv[i])) {
      obj[argv[i]] = checkArgus(argv[i+1]) ? '' : obj[argv[i+1]]
    }
  }
  return obj
}

const sshDel = () => {
  const obj = parseArgv()
  let model = ''
  if (obj.hasOwnProperty('--production')) {
    model = 'production'
  }
  console.log(config.ssh[model])
  const gulpSSH = new ssh({
    ignoreErrors: false,
    sshConfig: config.ssh[model],
  })
  return gulpSSH.shell([
      // 删除现有文件
      `rm -rf ${config.build.dist}`,
    ], {
      filePath: 'commands.log'
    })
    .pipe(dest('logs'))
}

const update = () => {
  console.log(deployFtp)
  return src(config.build.dist)
    .pipe(deployFtp({
      remotePath: '',
      host: 'localhost',
      port: 21,
      user: '',
      pass: ''
    }))
    .pipe(dest(config.build.dist))
}

const deploy = () => {
  Promise.resolve()
    .then(sshDel)
    .then(update)
    .catch(error => console.log(error))
}

module.exports = {
  // scripts,
  pages,
  clean,
  serve,
  build,
  start,
  lint
  // deploy // 未完成
}