const Mock = require('mockjs')

exports.test = async (req, res, next) => {
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