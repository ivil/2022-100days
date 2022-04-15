import CryptoJS from 'crypto-js'

// AES+base64加解密

const key = CryptoJS.enc.Utf8.parse('123456789asdfghj') // 十六位十六进制数作为密钥
const iv = CryptoJS.enc.Utf8.parse('asdfghj123456789') // 十六位十六进制数作为密钥偏移量

export const encrypt = (value: any) => {
  const srcs = CryptoJS.enc.Utf8.parse(value)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return encrypted.ciphertext.toString()
}

export const decrypt = (value: any) => {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(value)
  const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
