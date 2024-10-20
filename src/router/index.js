import { createRouter, createWebHistory } from 'vue-router'
import router from "@/router";

import Login from '../views/login-page.vue';

function beforeEnter(to, from, next) {
  if (!sessionStorage.getItem("login")) {
    router.push("login");
  } else {
    next();
  }
}

const routerConfig = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/' ,
      redirect: 'login',
    },
    {
      path: '/login' ,
      name: 'login' ,
      component: Login
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('../views/list-page.vue'),
      beforeEnter,
    }
  ]
});

export default routerConfig;
