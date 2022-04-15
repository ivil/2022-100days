// 图形验证码
const captcha = require('svg-captcha')

const createCaptcha = () => {
    return captcha.create({
        size: 4,
        ignoreChars: '0o1iIl',
        noise: 3,
        color: true,
        background: '#fff',
        fontSize: 60
    })
}

module.exports = createCaptcha