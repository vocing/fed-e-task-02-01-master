// plop入口文件
module.exports = plop => {
  plop.setGenerator('component', {
    description: 'create a component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'component name',
        default: 'component'
      },
      {
        type: 'input',
        name: 'path',
        message: 'component path',
        default: 'components/common'
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/{{path}}/{{name}}/index.vue',
        templateFile: 'tools/plop-templates/index.vue'
      },
      {
        type: 'add',
        path: 'src/{{path}}/{{name}}/index.styl',
        templateFile: 'tools/plop-templates/index.styl'
      }
    ]
  })
}