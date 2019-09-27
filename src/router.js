import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Favorites from './views/Favorites.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path: '/favorites', name: 'favorites', component: Favorites},
    {path: '/:id?', name: 'home', component: Home},
  ]
})
