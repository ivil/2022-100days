import Transfer from '../views/transaction/Transfer.vue'
import Transfer2 from '../views/transaction/Transfer2.vue'
import Recharge from '../views/transaction/Recharge.vue'
import TransferSuccess from '../views/transaction/TransferSuccess.vue'
import Withdraw from '../views/transaction/Withdraw.vue'
import BalanceQuery from '../views/transaction/BalanceQuery.vue'
import Record from '../views/transaction/Record.vue'
import Details from "../views/transaction/Details.vue"
import TransferPeople from "../views/transaction/TransferPeople.vue"
import TransferReset from '../views/transaction/TransferReset.vue'

const transationRouter = [
    {
        path: '/transfer',
        name: 'Transfer',
        component: Transfer,
    }, 
    {
        path:'/transfer2',
        name:'Transfer2',
        component: Transfer2,
    },
    {
        path:'/transferSuccess',
        name:'TransferSuccess',
        component:TransferSuccess,
    },
    {
        path:'/transferPeople',
        name:'TransferPeople',
        component:TransferPeople,
    },
    {
        path: '/recharge',
        name: 'Recharge',
        component: Recharge,
    },
    {
        path:'/withdraw',
        name:'withdraw',
        component:Withdraw,
    },
    {
        path: '/balanceQuery',
        name: 'BalanceQuery',
        component: BalanceQuery,
    },
    {
        path: '/record',
        name: 'Record',
        component: Record,
    },
    {
        path: '/details',
        name: 'Details',
        component: Details,
    },
    {
        path: '/transferReset',
        name: 'TransferReset',
        component: TransferReset,
    }
]

export default transationRouter;