import type { RouteRecordRaw } from 'vue-router'
// eslint-disable-next-line import/no-unresolved

const userRouter: RouteRecordRaw[] = [
  // 手机号登录
  {
    path: '/loginByPassword',
    name: 'LoginByPassword',
    component: () => import('@/views/user/login/LoginByPassword.vue'),
  },
  // 注册
  {
    path: '/register',
    name: 'RegisterView',
    component: () => import('@/views/user/login/RegisterView.vue'),
  },
  // 验证码登录
  {
    path: '/loginByPhone',
    name: 'LoginByPhone',
    component: () => import('@/views/user/login/LoginByPhone.vue'),
  },
  // 忘记密码
  {
    path: '/retrievePassword',
    name: 'RetrievePassword',
    component: () => import('@/views/user/login/RetrievePassword.vue'),
  },
  // 开户
  {
    path: '/openAccount',
    name: 'OpenAccount',
    component: () => import('@/views/user/account/OpenAccount.vue'),
  },
  // 绑卡
  {
    path: '/bindCard',
    name: 'BindCard',
    component: () => import('@/views/user/account/BindCard.vue'),
  },
  // 解绑卡
  {
    path: '/unBindCard',
    name: 'UnBindCard',
    component: () => import('@/views/user/info/UnBindCard.vue'),
  },
  // 修改支付密码
  {
    path: '/updatePayPassword',
    name: 'UpdatePayPassword',
    component: () => import('@/views/user/update/UpdatePayPassword.vue'),
  },
  // 修改登录密码
  {
    path: '/updatePassword',
    name: 'UpdatePassword',
    component: () => import('@/views/user/update/UpdatePassword.vue'),
  },
  // 修改手机号
  {
    path: '/updatePhone',
    name: 'UpdatePhone',
    component: () => import('@/views/user/update/UpdatePhone.vue'),
  },
  // 设置
  {
    path: '/settings',
    name: 'SettingsView',
    component: () => import('@/views/user/info/SettingsView.vue'),
  },
  // 注销
  {
    path: '/logout',
    name: 'LogOut',
    component: () => import('@/views/user/login/LogOut.vue'),
  },
]
export default userRouter
