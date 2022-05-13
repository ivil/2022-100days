const registerRoutes = [{
    path: '/register',
    name: 'Register',
    component: () => import('../../views/login/Register.vue')
}]

export default registerRoutes