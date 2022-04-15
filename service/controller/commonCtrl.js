const Mock = require('mockjs')
const createCaptcha = require('../utils/captcha')

exports.getPhoneCode = async (req, res, next) => {
    try {
        setTimeout(() => {
            res.status(299).json(Mock.mock({
                code: '000000',
                msg: '获取交易记录成功！！！',
            }))
        }, 500)
    } catch (e) {
        next(e)
    }
}

exports.getCaptcha = async (req, res, next) => {
    try {
        console.log(req);
        let captcha = createCaptcha();
        res.type('svg')
        res.status(200).send(captcha.data)
        res.end()
    } catch (e) {
        next(e)
    }
}