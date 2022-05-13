class Check {
    constructor() { }
    /**
     * @description 检测是否为空
     */
    checkIsEmpty(v) {
        if (v !== '') {
            return true
        } else {
            console.warn("表单不能为空！！！");
            return false
        }
    }
    /**
     * @description 检测支付密码
     */
    checkPayPass(v){
        let reg = /^\d{6}$/;
        if (reg.test(v)) {
            return true
        } else {
            console.warn("只能输入六位数字！！！");
            return false;
        }
    }
    /**
     * 
     * @param {*} v 检测银行卡格式
     * @returns 
     */
    checkCardID(v){
        let reg = /^([1-9]{1})(\d{15}|\d{18})$/;
        if(reg.test(v)){
            return true
        }else{
            console.warn("银行卡号格式不正确！！！");
            return false
        }
    }
    /**
     * 
     * @param {*} v 检测手机号
     * @returns 
     */
    checkPhoneNumber(v){
        let reg = /^1[3-9]\d{9}$/;
        if(reg.test(v)){
            return true
        }else{
            console.warn("请输入正确的手机号！！！");
            return false
        }
    }
}

export default Check