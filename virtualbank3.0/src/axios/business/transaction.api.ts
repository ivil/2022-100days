/**
 * @description 交易模块的API，例如充值提现，转账等与交易相关的api
 * @description 返回值result是纯数据，若不是纯数据但请求成功则返回true
 */
import instance from '../config/net'
import { transactionApi } from '../api'

/**
 * @description 查询银行卡列表
 */
export const getBankCardList = async () => {
  try {
    const result = await instance.get(transactionApi.balance)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 充值
 */
export const rechargeRequest = async (data: deal) => {
  try {
    const result = await instance.post(transactionApi.recharge, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 提现
 */
export const withdrawRequest = async (data: deal) => {
  try {
    const result = await instance.post(transactionApi.withdraw, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 转账
 */
export const transfer = async (data: transfer) => {
  try {
    const result = await instance.post(transactionApi.transfer, data)
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 跨行转账
 */
export const crossTransfer = async (data: transfer) => {
  try {
    const result = await instance.post(transactionApi.transfer, data)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 全部交易记录
 */
export const tradingRecords = async () => {
  try {
    const result = await instance.get(transactionApi.records)
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 按卡号查交易记录
 */
export const queryByCard = async (cardId: any) => {
  try {
    const result = await instance.post(transactionApi.queryByCard, {
      cardId,
    })
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 按时间查交易记录
 */
export const queryByTime = async (date1: string, date2: string) => {
  try {
    const result = await instance.post(transactionApi.queryByTime, {
      date1,
      date2,
    })
    return result
  } catch (e) {
    return e
  }
}
