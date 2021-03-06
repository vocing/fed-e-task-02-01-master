const {
  src,
  dest,
  series,
  parallel,
  watch
} = require('gulp')

// const cleanCss = require('gulp-clean-css') // 压缩代码
// const rename = require('gulp-rename')
// const sass = require('gulp-sass') // _开头的scss文件默认不会编译
// const babel = require('gulp-babel')
// const swig = require('gulp-swig')
// const imagemin = require('gulp-imagemin')

// gulp-load-plugins 获取所有的gulp插件, 生成一个对象
const plugins = require('gulp-load-plugins')()
const {
  rename,
  sass,
  babel,
  swig,
  imagemin,
  useref, // 构建打包工具
  /* useref 此例中将 注释中间的引入内容("/css/main.min.css"、"/node_modules/bootstrap/dist/css/bootstrap.css"),
     打包到注释路径(css/vendor.css)中
    <!-- build:css css/vendor.css-->
    <link rel="stylesheet" href="/css/main.min.css" />
    <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css" />
    <!-- endbuild-->
  */
  htmlmin, // 压缩html
  uglify, // 压缩js
  cleanCss, // 压缩css
} = plugins

const del = require('del')
const browserSync = require("browser-sync")
const bs = browserSync.create()

const styleFiles = 'src/scss/**.scss'
const style = () => {
  return src(styleFiles, { base: 'src/scss' })
    .pipe(sass({ outputStyle: 'expanded' })) // outputStyle 指定编译结果格式
    // .pipe(cleanCss())
    // .pipe(rename({ extname: '.min.css'}))
    .pipe(dest('temp/css'))
    //  修改后,使浏览器热更新的一种方式
    // .pipe(bs.reload({ stream: true }))
}

const jsFiles = 'src/js/**.js'
const js = () => {
  return src(jsFiles, { base: 'src' })
    // 不配置 @babel/preset-env 时 只会复制文件,不会编译
    .pipe(babel({ presets: ['@babel/preset-env'] }))
    // .pipe(cleanCss())
    // .pipe(rename({ extname: '.min.js'}))
    .pipe(dest('temp'))
}

const pageFiles = 'src/html/*.html'
const page = () => {
  return src(pageFiles, { base: 'src' })
    //入参为编译模板文件内部数据的来源
    .pipe(swig({ data: { name: 'test' } }))
    // .pipe(uglify())
    .pipe(dest('temp'))
}

const imagesFiles = 'src/images/**'
const images = () => {
  return src(imagesFiles, { base: 'src' })
    .pipe(imagemin())
    .pipe(dest('dist'))
}

const fontsFiles = 'src/fonts/**'
const fonts = () => {
  return src(fontsFiles, { base: 'src' })
    .pipe(imagemin())
    .pipe(dest('dist'))
}

const extraFiles = 'public/**'
const extra = () => {
  return src(extraFiles, { base: 'public' })
    .pipe(dest('dist'))
}

const clean = () => {
  // del 是一个promise方法
  return del(['dist'])
}

const userefs = () => {
  // dist 临时目录
  return src('temp/**', { base: 'temp' })
    .pipe(useref({ searchPath: ['temp', '.']}))
    .pipe(plugins.if(/\.js$/, uglify()))
    .pipe(plugins.if(/\.html$/, htmlmin({
      removeComments: true,//清除HTML注释
      collapseWhitespace: true,//压缩HTML
      collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
      removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
      minifyJS: true,//压缩页面内的JS
      minifyCSS: true//压缩页面内的CSS
    })))
    .pipe(plugins.if(/\.css$/, cleanCss()))
    .pipe(dest('dist'))
}

const serve = () => {
  watch(styleFiles, style)
  watch(jsFiles, js)
  watch(pageFiles, page)
  // watch(imagesFiles, images)
  // watch(fontsFiles, fonts)
  // watch(extraFiles, extra)
  watch([
    imagesFiles,
    fontsFiles,
    extraFiles
  ], () => {
    bs.reload()
    return Promise.resolve() // 要有异步任务返回操作, 不然只会执行一次
  })
  bs.init({
    notify: false, // 提示
    port: 3000,
    // open: false,
    files: 'temp/**', // 指定的文件(改变后, 自动执行浏览器更新)
    server: {
      // baseDir 文件请求的查找方式, 优先在前面的目录中查找，没有就往后的目录找
      baseDir: ['temp', 'src', 'public'],
      routes: {
        '/node_modules': 'node_modules', // 文件夹名称查找指向
      }
    }
  })
}

// 集成
// src下的文件需要热更新
const compile = parallel(style, js, page)
// 上线前打包
const build = series(
  clean,
  parallel(
    series(compile, userefs),
    extra,
    images,
    fonts
  )
)
// 开发环境需要热更新和浏览器
const dev = series(compile, serve)

module.exports = {
  // style,
  // js,
  // page,
  // images,
  // fonts,
  // userefs,
  // compile,
  clean,
  build,
  // serve,
  dev
}