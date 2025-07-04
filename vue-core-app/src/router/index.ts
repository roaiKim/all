import { createRouter, createWebHistory } from "vue-router"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../pages/common/login/component/index.vue"),
    },
    {
      path: "/",
      name: "home",
      component: () => import("../pages/common/main/component/index.vue"),
    },
  ],
})

export default router
