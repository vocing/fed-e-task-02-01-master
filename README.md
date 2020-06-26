简答题

1、谈谈你对工程化的初步认识，结合你之前遇到过的问题说出三个以上工程化能够解决问题或者带来的价值。
答: a、工程化的目的，是以减少重复工作、提高工作效率。
    b、主要涉及到四个方面：模块化、组件化、规范化、自动化。
    模块化：将文件拆分为各个单元，通过引用拼接组成一个可直接使用的文件，又可分为：html、js、css及项目目录结构的模块化；
    组件化：将html、js、css组合成一个可视化的文件模块，可以经过组合各组件在界面展示特定的内容；
    规范化：不规范的书写方式，会影响可读性、扩展性、及一些可能出现的bug，又可分为：资源目录规范，前后端分离规范，业务与逻辑分离，统一书写方式，统一命名等规范；
    自动化: 将一切繁杂的工作尽可能的交给机器完成，包括：JS、css、html编译，svg编译字体文件，png、jpg的压缩或合并，自动化构建、部署、测试等；
    c、之前遇到过的问题：
        模块化不彻底，例如components目录下放入一堆组件，无法辨识哪些是公用的，哪些是项目私有的，且命名不规范导致阅读起来费劲，后来的项目对此做了些调整；
        组件化太粗糙，一个业务文件装满了该业务相关内容，后细化为各个功能组件，私有可复用的组件放入私有组件目录，私有不可复用的放入该业务目录下的特定目录中；
        自动化太基础，旧的vue项目仅对js、vue、stylus文件进行了编译压缩，后新增了svg自动编译字体图标文件；对组件的颜色抽离，便于开发白天黑夜模式；配置开发环境、测试环境、生产环境不同的内容以取代打包时手动全局替换特定内容


2、你认为脚手架除了为我们创建项目结构，还有什么更深的意义？
答： 脚手架创建项目结构为开发提供了基础的开发方式，其更深的意义是提供了一个优秀的思维模式，我们可以学习吸收其思维模式，或是对比各脚手架优劣思考一套更好更强大的思维模式；或是在优秀的脚手架基础之上为其添砖加瓦随之成长；当然更多的情况可能是在项目中，脚手架为我们提供了这样一个开发方式，我们以此为基础配置各种优秀的插件来极大的提升我们的开发效率及可扩展便于未来比较长的一段时间后该项目依旧可用且不难理解。

编程题

1、概述脚手架实现的过程，并使用 NodeJS 完成一个自定义的小型脚手架工具
答：脚手架实现过程：读取流、转换流、写入流。其中可穿插一些询问输入内容、自动化的方式在转换流中进行，从而使得源文件被编译成想要的得到的文件

2、尝试使用 Gulp 完成 项目 的自动化构建

3、使用 Grunt 完成 项目 的自动化构建


2-3 题基础代码下载地址：https://github.com/lagoufed/fed-e-001/raw/master/tasks/02-01-base-code.zip


