import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'posts' },
    component: () => import('@/App.vue'),
    children: [
      {
        path: "/posts",
        name: "posts",
        component: () =>
          import(/* webpackChunkName: "Posts" */ "@/modules/Posts/views/Posts.vue"),
      },
    ]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
