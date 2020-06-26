

module.exports = grunt => {
  // grunt.initConfig配置属性, grunt.config取用属性
  grunt.initConfig({
    foo: "bar",
    fooObj: {
      bar: "bar2"
    },
    build: { // 多目标配置
      options: {
        foo: "bar",
        other: "others"
      }, // options 为配置选项出现，并不会作为目标, 其余属性皆会成为目标
      css: {
        options: { // 目标中配置的options同名属性, 可以覆盖父对象中options中对应的属性
          foo: "baz"
        }
      }, // 键名为目标target, 键值为数据data
      js: "2"
    },
    clean: {
      temp: "temp/*.text", // 指向文件, 清理文件后目录会保留,
      // temp: "temp/**", // 指向目录, 直接清理temp目录
    }
  })

  // initConfig 中注册clean, 配置此任务, 运行yarn grunt clean 执行
  // 插件的使用方法grunt.loadNpmTasks("插件名")
  grunt.loadNpmTasks("grunt-contrib-clean")

  // 多目标, 执行
  grunt.registerMultiTask("build", function () {
    console.log(this.options())
    console.log(this)
  })
  

  grunt.registerTask('foo', () => {
    console.log(grunt.config("foo"))
    console.log(grunt.config("fooObj").bar)
    console.log("hello, grunt")
  })

  
  grunt.registerTask('bar', '任务描述', () => {
    console.log("hello, otherTask")
  })
  // default 默认事件
  // grunt.registerTask('default', '任务描述', () => {
  //   console.log("hello, otherTask")
  // })

  /* 如果未定义异步方法(done)的异步任务的触发时间在定义了异步方法的异步任务之后
   * 则不会执行
   */
  grunt.registerTask("async5", () => {
    setTimeout(() => {
      console.log("延迟5秒")
    }, 5000)
  })
  
  // 同上
  grunt.registerTask("async", () => {
    setTimeout(() => {
      console.log("延迟3秒")
    }, 3000)
    // return false 用于 标记失败，失败的任务会导致后面的任务不再执行(任务阻塞)
    // return false
  })

  /* 定义异步方法 done = this.async(), 且需要有done()回调, 才会执行
   * 触发done()不会立马结束, 而是会继续执行完这一轮的微任务
   */ 
  grunt.registerTask("async-task", function () {
    // 定义done, 以执行异步任务
    const done = this.async()
    setTimeout(() => {
      done(false) // 异步任务标记失败
      const time = 4
      console.log(`延迟${time}秒`)
    }, 4000)
  })
  grunt.registerTask("async-task6", function () {
    // 定义done, 以执行异步任务
    const done = this.async()
    setTimeout(() => {
      done()
      const time = 6
      console.log(`延迟${time}秒`)
    }, 6000)
  })

  grunt.registerTask(
    'default',
    ['foo', 'bar', 'async5', 'async', 'async-task', 'async-task6']
  ) // 串联任务
}