const express = require('express')
const router = express.Router()
const commonCtrl = require('../controller/commonCtrl')

const routes = [
    {
        path: '/register',
        children: [
            router.get('/common/getPhoneCode', commonCtrl.getPhoneCode),
            router.get('/common/getPhotoCode', commonCtrl.getCaptcha),
            router.post('/common/checkPhotoCode',(req,res,next)=>{
                setTimeout(()=>{
                    res.status(200).json({
                        code:'000000',
                        msg:''
                    })
                },1000)
            })
        ]
    },
    {
        path: '/',
        children: [
            router.get('/test', commonCtrl.getPhoneCode)
        ]
    }
]


routes.forEach(el => {
    router.use(el.path, el.children)
})

module.exports = router