import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { Dialog, Toast } from 'vant'
import homeRouter from './commonRouter/homeRouter'
import transactionRouter from '@/router/businessRouter/transactionRouter'
import userRouter from '@/router/businessRouter/userRouter'
import financeRouter from '@/router/businessRouter/financeRouter'
import store from '@/store/state'
import { buyGood } from '@/axios/business/goods.api'

const routes: Array<RouteRecordRaw> = [
  ...homeRouter,
  ...userRouter,
  ...financeRouter,
  ...transactionRouter,
  {
    path: '/notFound',
    name: 'NotFound',
    component: () => import('../components/NotFound.vue'),
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false,
    },
  },
  {
    path: '/:catchAll(.*)', // 不识别的path自动匹配404
    redirect: '/notFound',
  },
  // 测试主页升级
  {
    path: '/HomePlus',
    name: 'HomePlus',
    component: () => import('@/views/home/HomePlus.vue'),
  },
  // 商品记录
  {
    path: '/PointRecord',
    name: 'PointRecord',
    component: () => import('@/views/home/PointRecord.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// 全局导航守卫
// 未登录
const beforLogin = [
  'MainIndex',
  'HomeView',
  // 'about',
  // 'Mine',
  // 'FundIndex',
  'LoginByPassword',
  'RegisterView',
  'LoginByPhone',
  'RetrievePassword',
  'NotFound',
]
// 已登录未开户绑卡
const transaction = [
  'IndexView',
  'RechargeView',
  'WithdrawView',
  'TransferView',
  'TrandingRecords',
  'BalanceView',
  'BindCard',
  'UnBindCard',
]

// router.beforeEach((to: any, from: any, next) => {
//   // 是否开户
//   // const isOpenAccount = store.state.statusOfOpenAccount
//   // 是否绑卡
//   // const isBindCard = store.state.statusOfBindCard
//   // token
//   const token = store.state.token || sessionStorage.getItem('token')

//   if (beforLogin.includes(to.name)) {
//     next()
//   } else if (token) {
//     next()
//   } else {
//     Dialog.confirm({
//       title: '提示',
//       message: '您还未登录，请先登录',
//     })
//       .then(() => {
//         // on confirm
//         next('/loginByPassword')
//       })
//       .catch(() => {
//         // on cancel
//       })
//   }
// })

export default router
