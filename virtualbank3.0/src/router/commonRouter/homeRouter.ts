import type { RouteRecordRaw } from 'vue-router'

const homeRouter: RouteRecordRaw[] = [
  // 在App上加上一层页面
  {
    path: '/MainIndex',
    name: 'MainIndex',
    component: () => import('@/views/home/MainIndex.vue'),
    children: [
      // 首页
      {
        path: '/',
        name: 'HomeView',
        component: () => import('@/views/home/HomeView.vue'),
      },
      // 生活
      {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '@/views/home/AboutView.vue'),
      },
      // 我的
      {
        path: '/mine',
        name: 'Mine',
        component: () => import(/* webpackChunkName: "about" */ '@/views/home/Mine.vue'),
      },
      // 基金首页
      {
        path: '/FundIndex',
        name: 'FundIndex',
        component: () => import('@/views/home/FundIndex.vue'),
      },
    ],
  },
]

export default homeRouter
