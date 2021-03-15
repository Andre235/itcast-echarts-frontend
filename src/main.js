import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import './assets/css/global.less'
import './assets/font/iconfont.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'
// 将axios挂载到Vue的原型对象上
// 在别的Vue组件中可以使用this.$http发起ajax请求
Vue.prototype.$http = axios

// 将全局Echarts对象挂载到Vue的原型对象上
// 然后在别的组件中就可以使用this.$echarts使用全局echarts对象了
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
