const logoutRoutes = [{
    path: '/logout',
    name: 'logout',
    component: () => import('../../views/login/Logout.vue')
}]

export default logoutRoutes