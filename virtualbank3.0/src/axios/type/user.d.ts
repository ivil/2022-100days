/**
 * @description 注册要提交的数据
 */
type register = {
  userPhone: string
  userPassword: string
  phoneCode: string
  codeKey: string
}

/**
 * @description 手机号登录
 */
type loginByPhone = {
  userPhone: string
  phoneCode: string
  codeKey: string
}

/**
 * @description 密码登录
 */
type loginByPwd = {
  userPhone: string
  userPassword: string
}

/**
 * @description 开户
 */
type openAccount = {
  name: string
  idNumber: string
  cardPassword: string
}

/**
 * @description 绑卡
 */
type bindCard = {
  cardNumber: string
  codeKey: string
  codeData: string
}

/**
 * @description 解绑卡
 */
type unbindCard = {
  cardId: any
  payPassword: string
  code: string
  codeKey: string
}

/**
 * @description 修改手机号
 */
type updatePhone = {
  code: string
  newPhone: string
}

/**
 * @description 修改支付密码
 */
type updatePayPassword = {
  code: string
  newPayPassword: string
}

/**
 * @description 修改登录密码
 */
type updatePassword = {
  oldLoginPassword: string
  newLoginPassword: string
}

/**
 * @description 注销
 */
type logout = {
  code: string
  codeKey: string
}
