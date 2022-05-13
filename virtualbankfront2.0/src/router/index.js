import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Finance from '../views/Finance.vue'
import Me from '../views/Me.vue'
import accountRouter from '../router/account';
import financeRouter from './finance'
import integralRouter from './integral'
import dealRouters from './deal'


// transaction 路由
import transationRouter from '../router/transation'

import loginRoutes from './login/index'


Vue.use(VueRouter)

const routes = [{
  path: '/',
  name: 'Index',
  component: Index
},
{
  path: '/finance',
  name: 'Finance',
  component: Finance
},
{
  path: '/me',
  name: 'Me',
  component: Me
},
...transationRouter,
...financeRouter,
...integralRouter,
...accountRouter,
...loginRoutes,
...dealRouters,
{
  path: '/notFound',
  name: 'NotFound',
  component: () => import('../views/login/NotFound.vue'),
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
{
  path: '*',
  redirect: '/notFound'
}

]

// 对Router原型链上的push、replace方法进行重写，这样就不用每次调用方法都要加上catch。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})


// 全局导航守卫
let filter = [
  "Index",
  "ForgetPass",
  "Find",
  "PhoneCodeSign",
  "PassSign",
  "Register",
  // "NotFound"
]
let filter2 = [
  "Me",
  "Finance",
  "Settings",
  "ModifySignPass",
  "ModifyPayPass",
  "Cancellation",
  "logout"
]

// router.beforeEach((to, from, next) => {
//   if (filter.includes(to.name)) {
//     next();
//   } else {
//     let userData = sessionStorage.getItem("user");
//     if (userData === null) {
//       next('/passSign');
//     } else {
//       if (filter2.includes(to.name)) {
//         next();
//       } else {
//         userData = JSON.parse(userData);
//         if (userData.accountId === null && to.name !== 'OpenAccount') {
//           next('/openAccount');
//         }
//       }
//       next();
//     }
//   }
// })



export default router