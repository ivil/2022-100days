import ProductDetail from '../views/finance/ProductDetail.vue'
import Position from '../views/finance/Position.vue'
import PositonDetail from '../views/finance/PositionDetail.vue'
import Back from '../views/finance/Back.vue'
import BackSuccess from '../views/finance/BackSuccess.vue'
import BuyProduct from '../views/finance/BuyProduct.vue'
import BuySuccess from '../views/finance/BuySuccess.vue'

const financeRouter = [
    {
        path: '/productDetail',
        name: 'ProductDetail',
        component: ProductDetail
    },
    {
        path: '/position',
        name: 'Position',
        component: Position
    },
    {
        path: '/positionDetail',
        name: 'PositionDetail',
        component: PositonDetail
    },
    {
        path: '/back',
        name: 'Back',
        component: Back
    },
    {
        path: '/backSuccess',
        name: 'BackSuccess',
        component: BackSuccess,
    },
    {
        path: '/buyProduct',
        name: 'BuyProduct',
        component: BuyProduct,
    },
    {
        path: '/buySuccess',
        name: 'BuySuccess',
        component: BuySuccess,
    },
]

export default financeRouter