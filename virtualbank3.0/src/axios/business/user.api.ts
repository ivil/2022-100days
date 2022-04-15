/**
 * @description 用户模块的api，例如登录注册以及与个人信息相关的版本
 * @description 返回值result是纯数据，若不是纯数据但请求成功则返回true
 */
import instance from '../config/net'
import { userApi } from '../api'
/**
 * @description 注册
 */
export const register = async (data: register) => {
  try {
    const result = await instance.post(userApi.register, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 手机号登录
 */
export const loginByPhone = async (data: loginByPhone) => {
  try {
    const result = await instance.post(userApi.loginByPhone, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 密码登录
 */
export const loginByPassword = async (data: loginByPwd) => {
  try {
    const result = await instance.post(userApi.loginByPwd, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 开户
 */
export const openAccount = async (data: openAccount) => {
  try {
    const result = await instance.post(userApi.openAcount, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 绑卡
 */
export const bindCard = async (data: bindCard) => {
  try {
    const result = await instance.post(userApi.bindCard, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 解绑卡
 */
export const unBindCard = async (data: unbindCard) => {
  try {
    const result = await instance.post(userApi.unbindCard, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 根据卡号获取开户行和预留手机号
 */
export const getCardInfo = async (cardId: string) => {
  try {
    const result = await instance.post(userApi.getCardInfo, {
      cardNumber:cardId
    })
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 修改手机号
 */
export const updatePhone = async (data: updatePhone) => {
  try {
    const result = await instance.post(userApi.updatePhone, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 修改支付密码
 */
export const updatePayPassword = async (data: updatePayPassword) => {
  try {
    const result = await instance.post(userApi.updatePayPassword, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 修改登录密码
 */
export const updatePassword = async (data: updatePassword) => {
  try {
    const result = await instance.post(userApi.updatePassword, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 找回登录密码
 */
 export const retrievePassword = async (data: any) => {
  try {
    const result = await instance.post(userApi.retrievePassword, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 注销
 */
 export const logout = async (data:logout) => {
  try {
    const result = await instance.post(userApi.logout,data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 退出登录
 */
 export const sigout = async () => {
  try {
    const result = await instance.get(userApi.sigout)
    return result
  } catch (e) {
    return e
  }
}