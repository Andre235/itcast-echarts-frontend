import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/screen'
  },
  {
    path: '/screen',
    name: '大屏',
    component: () => import('views/ScreenPage.vue')
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
