#!/usr/bin/env node

// 如果是linux 或者 macOS 系统下还需要修改此文件的读写权限为755

console.log("cli working!")

const fs = require("fs")
const path = require("path")
const inquirer = require("inquirer")
const ejs = require("ejs")

inquirer.prompt([
  {
    name: "name",
    message: "请输入文件名"
  },
  {
    name: "message",
    message: "请输入文件说明"
  }
]).then(answer => {
    const templDir = path.join(__dirname, 'templates') // 源文件夹路径
    const destDir = process.cwd() // 项目路径
    fs.readdir(templDir, (err, files) => {
      if (err) throw err
      let url = path.join(destDir, `${answer.name}`)
      fs.exists(url, async (exists) => {
        if (!exists) {
          await fs.mkdir(url, function(error){
            if(error){
                console.log(error);
                return false;
            }
            console.log(`创建目录:url`);
          })
        }
        files.forEach(file => { // 读取源文件夹下的文件
          // ejs模板引擎对源文件的ejs字段进行读取并填充命令行问题的结果对象answer
          ejs.renderFile(path.join(templDir, file), answer, async (err, result) => {
            if (err) throw err        
            // 写入文件到目标目录
            fs.writeFileSync(path.join(destDir, `${answer.name}`, file), result)
          })
        })
      })
    })
})