const fs = require("fs")
const { Transform } = require("stream")

exports.default = done => {
  const readStream = fs.createReadStream("src/scss/main.scss")
  const writeStream = fs.createWriteStream("dist/scss/main.css")
  const transform = new Transform({
    transform: (chunk, encoding, callback) => {
      // 核心转换实现过程 读取流-转换流-写入流
      const input = chunk.toString() // 读取
      const output = input.replace(/(\s+|\/\*.+?\*\/)/g, '') // 转换, 此处是删除空格和注释
      callback(null, output)
    }
  })
  readStream
    .pipe(transform)
    .pipe(writeStream) // 写入
  return readStream
}