/**
 * @description 公共api
 */
import instance from '../config/net'
import { commonApi } from '../api'

/**
 *  @description 获取手机验证码
 */
export const getPhoneCode = async (userPhone: string) => {
  try {
    const result = await instance.get(commonApi.getPhoneCode, {
      params: {
        userPhone,
      },
    })
    return result
  } catch (e) {
    return e
  }
}

/**
 * @description 获取图形验证码
 */
export const getCaptcha = `http://u5m1589047.qicp.vip${commonApi.getCaptcha}? imgId = `

// export const getCaptcha = async (data: number) => {
//   try {
//     const result = await instance.get(commonApi.getCaptcha, { params: { imgId: data } })
//     return result
//   } catch (e) {
//     return e
//   }
// }

/**
 * @description 验证图形验证码
 */
export const checkCaptcha = async (data: any) => {
  try {
    const result = await instance.post(commonApi.checkCaptcha, data)
    return result
  } catch (e) {
    return e
  }
}
