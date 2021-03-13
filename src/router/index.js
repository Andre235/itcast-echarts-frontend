import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/sellerPage',
    name: '/sellerPage',
    component: () => import('views/SellerPage.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
