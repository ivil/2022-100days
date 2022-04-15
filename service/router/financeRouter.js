const express = require('express')
const router = express.Router()
const financeCtrl = require('../controller/financeCtrl')

const routes = [
    
]


routes.forEach(el => {
    router.use(el.path, el.children)
})

module.exports = router