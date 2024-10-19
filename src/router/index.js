import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login-page.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/' ,
      name: 'login' ,
      component: Login
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('../views/list-page.vue')
    }
  ]
})

export default router
