const express = require('express')
const router = express.Router()
const transactionCtrl = require('../controller/transactionCtrl')

const routes = [
    {
        path: '/trading',
        children: [
            router.post('/recharge', transactionCtrl.recharge),
            router.get('/balance', transactionCtrl.balance),
            router.post('/withdraw', transactionCtrl.withdraw),
            router.get('/getCardInfo', transactionCtrl.getCardInfo),
            router.post('/transfer', transactionCtrl.transfer),
            router.get('/records', transactionCtrl.records),
        ]
    },
    {
        path: '/balance',
        children: [
            router.get('/inquiry', transactionCtrl.balance),
        ]
    },
    {
        path: '/deal',
        children: [
            router.get('/trading/record', transactionCtrl.records),
            router.post('/trading/timerecord',transactionCtrl.records),
            router.get('/trading/cardrecord', transactionCtrl.records)
        ]
    },
]
routes.forEach(el => {
    router.use(el.path, el.children)
})

module.exports = router