import Deal from '../views/deal/Deal.vue'
import Transfer from '../views/deal/Transfer.vue'
import Card from '../views/deal/Card.vue'
import Record from '../views/deal/Record.vue'
import Recharge from '../views/deal/Recharge.vue'
import Withdraw from '../views/deal/Withdraw.vue'
import Details from '../views/deal/Details.vue'

const dealRouters = [
    {
        path: '/deal',
        name: 'Deal',
        component: Deal,
        children: [{
            path: 'card',
            component: Card,
        }, {
            path: 'transfer',
            component: Transfer,
        }, {
            path: 'record',
            component: Record,
        }, {
            path: 'recharge',
            component: Recharge,
        }, {
            path: 'withdraw',
            component: Withdraw,
        }, {
            path: 'details',
            component: Details,
        },
        ]
    }
]

export default dealRouters