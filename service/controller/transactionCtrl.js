const Mock = require('mockjs')

// 余额查询
exports.balance = async (req, res, next) => {
    try {
        let data = Mock.mock({
            code: '000000',
            msg: '余额查询成功！',
            'data|7-9': [
                {   
                    id:/\d{16}/,
                    userId:1,
                    cardNumber:/\d{16}/,
                    cardMoney:/\d{3,7}/,
                    bankType:/(中国银行)|(建设银行)|(光大银行)/,
                    cardType:'1',
                    cardState:'1'
                }
            ]
        })
        data.data.push(Mock.mock({
            cardNumber: /[1-9]\d{15}/,
            bankName: '电子账户',
            cardType: '2',
            cardMoney: /([1-9]{1}\d{3,9}\.\d{2})|(0\.\d{2})/,
            dailyMoney: /(50000\.00)|(100000\.00)|(1000000\.00)/
        }))
        setTimeout(() => {
            res.status(200).json(data)
        }, 500)
    } catch (e) { next(e) }
}

// 充值
exports.recharge = async (req, res, next) => {
    try {
        console.log(req.body);
        setTimeout(() => {
            res.status(299).json(Mock.mock({
                code: '000000',
                msg: '充值成功！！！',
            }))
        }, 500)
    } catch (e) {
        next(e)
    }
}

// 提现
exports.withdraw = async (req, res, next) => {
    try {
        console.log(req.body);
        setTimeout(() => {
            res.status(299).json(Mock.mock({
                code: '000000',
                msg: '提现成功！！！',
            }))
        }, 500)
    } catch (e) {
        next(e)
    }
}

// 根据卡号获取开户行
exports.getCardInfo = async (req, res, next) => {
    try {
        console.log(req);
        setTimeout(() => {
            res.status(299).json(Mock.mock({
                code: '000000',
                msg: '提现成功！！！',
                data: {
                    bankName: '中国银行',
                    phone: '17766669999'
                }
            }))
        }, 500)
    } catch (e) {
        next(e)
    }
}

// 转账
exports.transfer = async (req, res, next) => {
    try {
        console.log(req.body);
        setTimeout(() => {
            res.status(299).json(Mock.mock({
                code: '000000',
                msg: '转账成功！！！',
            }))
        }, 500)
    } catch (e) {
        next(e)
    }
}

// 获取交易记录
exports.records = async (req, res, next) => {
    try {
        setTimeout(() => {
            res.status(299).json(Mock.mock({
                code: '000000',
                msg: '获取交易记录成功！！！',
                'data|22-27': [
                    {
                        'name|+1': 1,
                        "money": /[1-9]{3,7}\.\d{2}/,
                        "type": /(转账|充值|提现)/,
                        "date": new Date().toLocaleString(),
                        "balance":/[1-9]\d{3,7}\.\d{2}/,
                        "description": /\w{7}/,
                        "other": /\w{11}/
                    }
                ]
            }))
        }, 500)
    } catch (e) {
        next(e)
    }
}
