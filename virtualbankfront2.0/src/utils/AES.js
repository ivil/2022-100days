import CryptoJS from 'crypto-js/crypto-js'

export function encrypt(pass) {

    var key = "i2financegroup3a";
    var iv = "ab3456ha89012346";
    var CBCOptions = {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    };
    var aeskey = CryptoJS.enc.Utf8.parse(key);
    var secretData = CryptoJS.enc.Utf8.parse(pass);
    var encrypted = CryptoJS.AES.encrypt(
        secretData,
        aeskey,
        CBCOptions
    );
    var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    return encryptedBase64Str;
}
// console.log(encrypt('123456'));
// 前端自用的AES
/*
 * 默认的 KEY IV     如果在加密解密的时候没有传入KEY和IV,就会使用这里定义的
 * 
 * 前后端交互时需要前后端密钥和初始向量保持一致
 */

const KEY = CryptoJS.enc.Utf8.parse("1234567890ABCDEF");//  密钥        长度必须为16位
const IV = CryptoJS.enc.Utf8.parse("123456");           //  初始向量    长度随意

/*
 * AES加密 ：字符串 key iv  返回base64
 */
export function EncryptFront(str, keyStr, ivStr) {
    let key = KEY
    let iv = IV

    if (keyStr && ivStr) {
        key = CryptoJS.enc.Utf8.parse(keyStr);
        iv = CryptoJS.enc.Utf8.parse(ivStr);
    }

    let srcs = CryptoJS.enc.Utf8.parse(str);
    var encrypt = CryptoJS.AES.encrypt(srcs, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,            //这里可以选择AES加密的模式
        padding: CryptoJS.pad.Pkcs7
    });
    return CryptoJS.enc.Base64.stringify(encrypt.ciphertext);
}

/*
 * AES 解密 ：字符串 key iv  返回base64
 */
export function DecryptFront(str, keyStr, ivStr) {
    let key = KEY
    let iv = IV

    if (keyStr && ivStr) {
        key = CryptoJS.enc.Utf8.parse(keyStr);
        iv = CryptoJS.enc.Utf8.parse(ivStr);
    }

    let base64 = CryptoJS.enc.Base64.parse(str);
    let src = CryptoJS.enc.Base64.stringify(base64);

    var decrypt = CryptoJS.AES.decrypt(src, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,            //这里可以选择AES解密的模式
        padding: CryptoJS.pad.Pkcs7
    });

    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}
