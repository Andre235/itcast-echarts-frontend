import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/seller',
    name: '销售统计',
    component: () => import('views/SellerPage.vue')
  },
  {
    path: '/trend',
    name: '销售趋势',
    component: () => import('views/TrendPage.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
