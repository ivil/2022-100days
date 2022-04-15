/**
 * @description 理财模块的ap
 * @description 返回值result是纯数据，若不是纯数据但请求成功则返回true
 */
import instance from '../config/net'
import { financeApi } from '../api'

/**
 * @description 基金问卷
 * @param point
 */
const riskLevel = async (point: number) => {
  try {
    const result = await instance.get(financeApi.riskLevel, { params: { riskLevel: point } })
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 查询所有基金
 */
export const allFund = async () => {
  try {
    const result = await instance.post(financeApi.allFund)
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 按类型查询基金
 * @param data
 */
export const queryFund = async (data: string) => {
  try {
    const result = await instance.get(financeApi.queryFund, { params: { type: data } })
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 股票基金申购
 * @param data
 */
export const SharesFundBuy = async (data: any) => {
  try {
    // const result = await instance.get(financeApi.SharesFundBuy, {
    //   params: { productsId: data.productsId, principal: data.principal, password: data.password },
    // })
    const result = await instance.post(financeApi.SharesFundBuy, data)
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 货币型基金申购
 * @param data
 * @constructor
 */
export const CurrencyFundBuy = async (data: object) => {
  try {
    const result = await instance.post(financeApi.CurrencyFundBuy, data)
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 股票型基金赎回
 * @param data
 * @constructor
 */
export const SharesFundBack = async (data: string) => {
  try {
    const result = await instance.get(financeApi.SharesFundBack, { params: { id: data } })
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 股票型基金部分赎回
 * @param productsId
 * @constructor
 */
export const SharesPartBack = async (data: string, data2: string) => {
  try {
    const result = await instance.get(financeApi.SharesPartBack, { params: { id: data, sharesHeld: data2 } })
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 货币型基金赎回
 * @param productsId 产品id
 * @constructor
 */
export const CurrencyBack = async (data: string) => {
  try {
    const result = await instance.get(financeApi.CurrencyBack, { params: { id: data } })
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 货币型基金部分赎回
 * @param data
 * @constructor
 */
export const CurrencyPartBack = async (data: string, data2: string) => {
  try {
    const result = await instance.get(financeApi.CurrencyPartBack, { params: { id: data, amount: data2 } })
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 股票型基金详情
 * @param productsId
 * @constructor
 */
export const SharesDetail = async (data: string) => {
  try {
    const result = await instance.get(financeApi.SharesDetail, { params: { id: data } })
    return result
  } catch (e) {
    return e
  }
}
/**
 * @description 货币型基金详情
 * @param productsId
 * @constructor
 */
export const CurrencyDetail = async (data: string) => {
  try {
    const result = await instance.get(financeApi.CurrencyDetail, { params: { id: data } })
    return result
  } catch (e) {
    return e
  }
}

export const allMoney = async () => {
  try {
    const result = await instance.post(financeApi.allMoney)
    return result
  } catch (e) {
    return e
  }
}

export const fundRecord = async () => {
  try {
    const result = await instance.post(financeApi.fundRecord)
    return result
  } catch (e) {
    return e
  }
}
export default riskLevel
