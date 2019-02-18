import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import addhx from './components/addhx.vue'
import fenxi from './components/fenxi.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/addhx',
      name: 'addhx',
      component: addhx
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/fenxi',
      name: 'fenxi',
      component: fenxi
    },
  ]
})
