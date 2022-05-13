import OpenAccount from '../views/account/OpenAccount.vue'
import BindCard from '../views/account/BindCard.vue'

const accountRouter = [
    {
        path: '/openaccount',
        name: 'OpenAccount', 
        component: OpenAccount
    },
    {
        path: '/bindcard',
        name: 'BindCard',
        component: BindCard
    }
]

export default accountRouter