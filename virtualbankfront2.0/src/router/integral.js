import Integral from '../views/integral/Integral.vue'
import IntegralMall from '../views/integral/IntegralMall.vue'
import GoodDetail from '../views/integral/GoodDetail.vue'
import LuckDraw from '../views/integral/LuckDraw.vue'

const integralRouter = [
    {
        path: '/integral',
        name: 'Integral',
        component: Integral
    },
    {
        path: '/integralMall',
        name: 'IntegralMall',
        component: IntegralMall
    },
    {
        path: '/goodDetail',
        name: 'GoodDetail',
        component: GoodDetail
    },
    {
        path: '/luckDraw',
        name: 'LuckDraw',
        component: LuckDraw
    },
]

export default integralRouter