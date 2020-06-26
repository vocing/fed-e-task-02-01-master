const fs = require("fs")
const path = require('path')
const Generator = require("yeoman-generator")

module.exports = class extends Generator {
  // yeoman 会在询问用户环节自动调用此方法
  prompting () {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // 项目生成目录名称
      }
    ])
      .then(answers => {
        this.answers = answers
      })
  }
  writing () {
    const outFolder = (templatePath, destinationPath) => {
      // 使用模板引擎渲染模板
      const templ = this.templatePath(templatePath)
      const output = this.destinationPath(destinationPath)
      const context = this.answers
      this.fs.copyTpl(templ, output, context)
    }
    const readFileList = (dir, filesList = []) => {
      const files = fs.readdirSync(dir);
      files.forEach((item, index) => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        outFolder(fullPath, path.join("./dist", item))
      });
      return filesList;
    }
    readFileList(`${__dirname}/templates`)
  }
}