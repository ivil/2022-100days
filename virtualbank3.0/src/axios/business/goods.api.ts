/**
 * @description 积分商城
 */
import instance from '../config/net'
import { financeApi } from '../api'

/**
 * @description 显示所有商品
 */
const allGoods = async () => {
  try {
    const result = await instance.post(financeApi.allGoods)
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 我的积分
 */
export const myPoint = async () => {
  try {
    const result = await instance.post(financeApi.myPoint)
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 购买商品
 * @param data
 */
export const buyGood = async (data: any) => {
  try {
    const result = await instance.post(financeApi.buyGood, data)
    return result
  } catch (e) {
    return e
  }
}

export const goodRecord = async () => {
  try {
    const result = await instance.post(financeApi.goodRecord)
    return result
  } catch (e) {
    return e
  }
}
export default allGoods
