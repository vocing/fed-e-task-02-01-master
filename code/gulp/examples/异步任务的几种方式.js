// 异步任务的几种方式：done, promise, async await
// 其余方式之一: stream

exports.callback = done => {
  done()
}

exports.callback_error = done => {
  const fail = new Error('task faild')
  done(fail) // 入参报错方法, 回调函数报错
}

exports.promise = done => {
  return Promise.resolve()
}

exports.promise_error = done => {
  const fail = new Error('task faild')
  return Promise.reject(fail)
}

const fn = () => {
  setTimeout(() => {
    console.log('async task')
  })
}
exports.async = async (done) => {
  await fn()
  console.log('async done')
}

// 通过stream处理异步任务
const fs = require("fs")
exports.stream = () => {
  const readStream = fs.createReadStream("package.json")
  const writeStream = fs.createWriteStream("package.txt")
  readStream.pipe(writeStream)
  return readStream
  // 因为gulp给readStream的end方法注册了函数 () => { done () }, 参见示例 streamEnd
}

// 此处等同于 stream
exports.streamEnd = done => {
  const readStream = fs.createReadStream("package.json")
  const writeStream = fs.createWriteStream("package.txt")
  readStream.pipe(writeStream)
  readStream.on("end", () => {
    done()
  })
}
