// eslint-disable-next-line import/no-extraneous-dependencies
import { JSEncrypt } from 'jsencrypt'
// eslint-disable-next-line import/no-extraneous-dependencies
import { b64tohex, hex2b64 } from 'jsencrypt/lib/lib/jsbn/base64'

// 加密
// str 未加密字符串
export function getEncryCode(str) {
  // 实例化JSEncrypt
  const jse = new JSEncrypt()
  // 加密公钥（由服务端生成）
  const pubKey = `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCmBjTNoNbIjrZVoEt5OBNM6zZ/
yDZ7wgv53A6ekTuAsqfJ3jXmLC7PqqrJxgqqDf2l72CnRC8ZxIAkiUBmIK/FIDrl
qCBPl1h0Ym8qPLmUuv5l3xmhlb6+a/v22444PW/U6Ur0l1BvbCorrsWV3leFFfLZ
5oT4mq9jXzkQLv8F6wIDAQAB
-----END PUBLIC KEY-----`

  jse.setPublicKey(pubKey)
  // const data = jse.encrypt(str.toString()) // 进行加密
  const data = jse.encryptLong(str.toString())
  return data
}

// 解密
// params 待解密字符串
export function sendEncryCode(params) {
  // 实例化JSEncrypt
  const jse = new JSEncrypt()
  // 使用前端私钥解密（私钥由服务端生成）
  const privKey = `-----BEGIN PRIVATE KEY-----
    MIICdQIBADANBgkqhkiG9w0BAQEFAASCAl8wggJbAgEAAoGBAKYGNM2g1siOtlWg
    S3k4E0zrNn/INnvCC/ncDp6RO4Cyp8neNeYsLs+qqsnGCqoN/aXvYKdELxnEgCSJ
    QGYgr8UgOuWoIE+XWHRibyo8uZS6/mXfGaGVvr5r+/bbjjg9b9TpSvSXUG9sKiuu
    xZXeV4UV8tnmhPiar2NfORAu/wXrAgMBAAECf0qUfyPgHJv7f+z3FPBfQExNXS4J
    wm/Vu4uCTw7sLs6hcr48E/pR3rVq9U2uqRu7LTZdUg3Rk1b/7pB7F3LJPCuX5n/t
    nqcEWfWoyAc6wnVLffxkvx7toD7nMl7+2/LsUgSiY/QFdG43dKs+5rXuEOOwcZV/
    tLdivN9SEN44mEECQQDXls/rpMPYnd0IHHqh6YZEA3dH1CZAWeW/4XF/BINW/02m
    jtoNr+sTcZN9ekaLFTQnF/jJRi35dNwGhroG+k/hAkEAxST9oYDugGPTbu81JU1p
    nO8tLQPHvpVu3lGQEFahWZi6j70FlhNEhX74lDLrhvTOI4ohzHX28pU5TbQkiyl/
    SwJBALxQseHmFGR80HurVLtlnrB+TozhlWAUpolLRbZrnMY7T/qzQWk/Rxm+1dR/
    IGuQ4/NaDyjRMot6Nk9FE+3QbEECQQCXib+MDVdHSXSUqTro2YB9KTxIhcdcL/Fw
    4rEiXfTYshV1t447tcPN+bOJ9zokGrj5iIxCZcrU3O+XUwlkDxnRAkArwYiJZFlS
    Lu9zj+e03+kGWu6c/x8RRoLqfZcWFffBZlkxOHa06aN6jYCdJtRON43JUbynMvDY
    l5glkcwnZlbi
    -----END PRIVATE KEY-----`

  jse.setPrivateKey(privKey)
  // const data = jse.decrypt(params) // 解密
  const data = jse.decryptLong(params)
  return data
}

// 分段加密
JSEncrypt.prototype.encryptLong = function (string) {
  const k = this.getKey()
  // var maxLength = (((k.n.bitLength() + 7) >> 3) - 11);//117
  try {
    let i
    // eslint-disable-next-line no-unused-vars
    const lt = ''
    let ct = ''
    // RSA每次加密117bytes，需要辅助方法判断字符串截取位置
    // 1.获取字符串截取点
    const bytes = []
    bytes.push(0)
    let byteNo = 0
    let len
    let c
    // eslint-disable-next-line prefer-const
    len = string.length
    let temp = 0
    // eslint-disable-next-line no-plusplus
    for (i = 0; i < len; i++) {
      c = string.charCodeAt(i)
      if (c >= 0x010000 && c <= 0x10ffff) {
        byteNo += 4
      } else if (c >= 0x000800 && c <= 0x00ffff) {
        byteNo += 3
      } else if (c >= 0x000080 && c <= 0x0007ff) {
        byteNo += 2
      } else {
        byteNo += 1
      }
      // eslint-disable-next-line eqeqeq
      if (byteNo % 117 >= 114 || byteNo % 117 == 0) {
        if (byteNo - temp >= 114) {
          bytes.push(i)
          temp = byteNo
        }
      }
    }
    // 2.截取字符串并分段加密
    if (bytes.length > 1) {
      // eslint-disable-next-line no-plusplus
      for (i = 0; i < bytes.length - 1; i++) {
        let str
        // eslint-disable-next-line eqeqeq
        if (i == 0) {
          str = string.substring(0, bytes[i + 1] + 1)
        } else {
          str = string.substring(bytes[i] + 1, bytes[i + 1] + 1)
        }
        const t1 = k.encrypt(str)
        ct += t1
      }
      // eslint-disable-next-line eqeqeq
      if (bytes[bytes.length - 1] != string.length - 1) {
        const lastStr = string.substring(bytes[bytes.length - 1] + 1)
        ct += k.encrypt(lastStr)
        // debugger;
      }
      return hex2b64(ct)
    }
    const t = k.encrypt(string)
    const y = hex2b64(t)
    return y
  } catch (ex) {
    return false
  }
}

// 分段解密长字符串
JSEncrypt.prototype.decryptLong = function (text) {
  // Return the decrypted string.
  // console.log(this);
  const k = this.getKey()
  // eslint-disable-next-line no-bitwise
  const maxLength = (k.n.bitLength() + 7) >> 3
  try {
    const str = b64tohex(text)
    // var b=hex2Bytes(str);

    const inputLen = str.length

    let ct = ''

    if (inputLen > maxLength) {
      const lt = str.match(/.{1,256}/g)
      lt.forEach((entry) => {
        const t1 = k.decrypt(entry)
        ct += t1
      })
      return ct
    }
    const y = k.decrypt(b64tohex(text))
    return y
  } catch (ex) {
    return false
  }
}
