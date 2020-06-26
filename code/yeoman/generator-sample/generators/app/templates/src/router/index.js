import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let routes = []
// 根据环境变量选择仅需要开发的路由
if (process.env.VUE_APP_ROUTER) {
  JSON.parse(process.env.VUE_APP_ROUTER).map(item => {
    if (item) {
      routes.push(...require(`./${item}`).default)
    }
  })
} else {
  routes = [
    {
      path: "/",
      redirect:'/business-viewpoint/page-detail'
    },
    ...require('./business-viewpoint.js').default
  ]
}
console.log(routes)
const router = new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  next()
})

export default router
