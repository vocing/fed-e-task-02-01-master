/*
 * gulp中专门用于读取流、写入流的api
 * src => 读取流
 * dest => 写入流
 * npm 插件 => 转换流
 */
const { src, dest } = require('gulp')
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename')

exports.default = () => {
  return src('src/scss/*.scss') // 读取流
    .pipe(cleanCss()) // 转换流
    .pipe(rename({ extname: '.min.css'})) // 转换流
    .pipe(dest('dist/css')) // 写入流
}