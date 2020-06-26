import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

Vue.config.productionTip = false
console.log(process.env.NODE_ENV)
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
