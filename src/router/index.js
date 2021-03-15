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
  },
  {
    path: '/map',
    name: '销售地图',
    component: () => import('views/MapPage.vue')
  },
  {
    path: '/rank',
    name: '销售排行',
    component: () => import('views/RankPage.vue')
  },
  {
    path: '/hot',
    name: '热销商品',
    component: () => import('views/HotPage.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
