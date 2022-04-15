/**
 * @description 公共模块API
 */
export const commonApi = {
  // 获取手机验证码
  getPhoneCode: '/register/common/getPhoneCode',
  // 获取图形验证码
  getCaptcha: '/register/common/getPhotoCode',
  // 验证图形验证码
  checkCaptcha: '/register/common/checkPhotoCode',
}

/**
 * @description 用户模块api
 */
export const userApi = {
  // 手机号注册
  register: '/register/register/registerUser',
  // 注销
  logout: '/install/logout',
  // 手机号登录
  loginByPhone: '/loginAndBind/login/phoneCodeLogin',
  // 密码登录
  loginByPwd: '/loginAndBind/login/passwordPhotoCodeLogin',
  // 找回登录密码
  retrievePassword: '/loginAndBind/forgetPassword/updatePassword',
  // 退出登录
  signOut: '/login/exit',
  // 开户
  openAcount: '/openAccount/openAcount',
  // 绑卡
  bindCard: '/loginAndBind/bindCard',
  // 解绑卡
  unbindCard: '/install/unbindCard',
  // 根据银行卡号获取预留手机号
  getCardInfo: '/loginAndBind/queryCardNumber',
  // 修改手机号
  updatePhone: '/install/update/phone',
  // 修改支付密码
  updatePayPassword: '/install/update/password',
  // 修改登录密码
  updatePassword: '/install/update/loginpwd',
  // 退出登录
  sigout: '/install/login/exit',
}

/**
 * @description 交易模块api
 */
export const transactionApi = {
  // 充值
  recharge: '/trading/trading/recharge',
  // 提现
  withdraw: '/trading/trading/withdrawal',
  // 转账
  transfer: '/trading/trading/transfer',
  // 跨行转账
  crossTransfer: '/trading/crossTransfer',
  // 余额查询
  balance: '/trading/balance/inquiry',
  // 交易记录
  records: '/deal/trading/record',
  // 按时间查询交易记录
  queryByTime: '/deal/trading/timerecord',
  // 按卡号查交易记录
  queryByCard: '/deal/trading/cardrecord',
}

/**
 * @description 理财模块api
 */
export const financeApi = {
  // 基金
  riskLevel: 'fundhome/Fund/select', // 风险测评
  allFund: '/fundhome/Fund/home', // 所有基金
  queryFund: '/fundhome/Fund/query', // 按类型查
  SharesFundBuy: 'fundPurchase/FundPurchaseConsumer/stockMonetaryFundPurchase', // 股票型申购
  CurrencyFundBuy: 'fundPurchase/FundPurchaseConsumer/monetaryFundPurchase', // 货币型申购
  SharesFundBack: '/redeem/Redeem/wholeShares', // 股票全部赎回
  SharesPartBack: '/redeem/Redeem/partShares', // 股票部分赎回
  CurrencyBack: '/redeem/Redeem/wholeCurrency', // 货币全部赎回
  CurrencyPartBack: '/redeem/Redeem/partCurrency', // 货币部分赎回
  SharesDetail: '/fundhome/Fund/record', // 股票基金详情
  CurrencyDetail: 'fundhome/Fund/monetaryFoudGoodsShow', // 货币基金详情
  allMoney: 'assets/assets/total', // 总资产
  fundRecord: 'deal/record/fund', // 交易记录
  // 积分商城
  allGoods: 'integral/IntegralMallConsumer/goodsShow', // 展示所有商品
  myPoint: 'integral/IntegralMallConsumer/integralSum', // 剩余积分
  buyGood: 'integral/IntegralMallConsumer/integralGoodsBuy', // 购买商品
  goodRecord: 'integral/IntegralMallConsumer/recordShow', // 交易记录
}
