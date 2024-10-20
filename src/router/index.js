import { createRouter, createWebHistory } from 'vue-router'
import router from "@/router";

import Login from '../views/login-page.vue';

function beforeRouteEnter(to, from, next) {
  if (!sessionStorage.getItem("login")) {
    next();
  } else {
    router.push("login");
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
      beforeRouteEnter,
    }
  ]
});

export default routerConfig;
