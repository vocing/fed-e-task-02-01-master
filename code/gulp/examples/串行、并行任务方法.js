// 串行、并行执行任务集合
const { series, parallel } = require("gulp")

const task1 = done => {
  setTimeout(() => {
    console.log('task1 working~~')
    done()
  }, 1000)
}

const task2 = done => {
  setTimeout(() => {
    console.log('task2 working~~')
    done() // 入参报错
  }, 1000)
}

const task3 = done => {
  setTimeout(() => {
    console.log('task3 working~~')
    done()
  }, 1000)
}

exports.sync = series(task1, task2, task3) // 同步(串行)任务
exports.async = parallel(task1, task2, task3) // 异步(并行)任务