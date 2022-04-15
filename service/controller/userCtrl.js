const Mock = require('mockjs')

exports.register = async (req, res, next) => {
    try {
        console.log(req.body);
        setTimeout(() => {
            res.status(299).json(Mock.mock({
                code: '000000',
                msg: '注册成功！！！',
            }))
        }, 500)
    } catch (e) {
        next(e)
    }
}

exports.loginByPhone = async (req, res, next) => {
    try {
        console.log(req.body);
        setTimeout(() => {
            res.status(299).json(Mock.mock({
                code: '000000',
                msg: '手机验证码登录成功！！！',
                data:'ivil.world'
            }))
        }, 500)
    } catch (e) {
        next(e)
    }
}

exports.loginByPassword = async (req, res, next) => {
    try {
        console.log(req.body);
        setTimeout(() => {
            res.status(299).json(Mock.mock({
                code: '000000',
                msg: '密码登录成功！！！',
                data:'ivil.world'
            }))
        }, 500)
    } catch (e) {
        next(e)
    }
}

exports.openAccount = async (req, res, next) => {
    try {
        console.log(req.body);
        setTimeout(() => {
            res.status(299).json(Mock.mock({
                code: '000000',
                msg: '开户成功！！！',
            }))
        }, 500)
    } catch (e) {
        next(e)
    }
}

exports.bindCard = async (req, res, next) => {
    try {
        console.log(req.body);
        setTimeout(() => {
            res.status(299).json(Mock.mock({
                code: '000000',
                msg: '绑卡成功！！！',
            }))
        }, 500)
    } catch (e) {
        next(e)
    }
}