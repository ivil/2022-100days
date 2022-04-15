const express = require('express')
const router = express.Router()

// 挂载交易模块路由
router.use(require('./transactionRouter'))

// 挂载用户模块路由
router.use(require('./userRouter'))

// 挂载理财模块路由
router.use(require('./financeRouter'))

// 挂载公共模块路由
router.use(require('./commonRouter'))

module.exports = router