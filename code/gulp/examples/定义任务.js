// gulp 中推荐使用导出函数成员的方式来定义gulp任务
exports.foo = done => {
  setTimeout(() => {
    console.log("foo task working~~")
    done() // 标识任务完成
  }, 1000)
  // gulp中最新的定义, 每个方法都是异步函数, 入参是结束任务的方法函数
}

// 默认导出函数
exports.default = done => {
  console.log("do not need taskName~~")
  done()
}

const gulp = require("gulp")
// 在gulp4.0以后的版本保留了该api, 所以仍可使用, 但是不推荐使用这种方式
gulp.task('bar', done => {
  console.log('bar working~~')
  done()
})