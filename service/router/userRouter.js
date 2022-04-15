const express = require('express')
const router = express.Router()
const userCtrl = require('../controller/userCtrl')

// 二级路由
const routes = [
    {
        path: '/loginAndBind',
        children: [
            router.post('/login/phoneCodeLogin', userCtrl.loginByPhone),
            router.post('/login/passwordPhotoCodeLogin', userCtrl.loginByPassword)
        ]
    }
]

routes.forEach(el => {
    router.use(el.path, el.children)
})

router.post('/openAccount',userCtrl.openAccount)
router.post('/bindCard',userCtrl.bindCard)


module.exports = router