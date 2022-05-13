class CheckForm {
    $form         //当前页面表单
    $valid = false; //整个表单校验是否通过
    $name = false;   //name校验是否通过
    $ID = false;    //身份证校验是否通过
    $pass = false;  //pass校验是否通过
    $passAgain = false; //校验两次密码是否一致
    $cardID = false;    //银行卡号校验是否通过
    $phoneNumber = false;    //手机号校验是否通过

    #pass1;         //密码1
    #pass2;         //密码2
    /**
     *
     * @param {object} form 要验证的表单
     */
    constructor(form = {}) {
        this.$form = form;
    }
    checkName(v) {
        let value = v ? v : this.$form.username;
        if (value !== '') {
            this.$name = true;
        } else {
            this.$name = false;
            console.warn("姓名不能为空！！！");
        }
        return this.$name;
    }
    checkID(v) {
        let value = v ? v : this.$form.ID;
        let reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
        if (reg.test(value)) {
            this.$ID = true;
        } else {
            this.$ID = false;
            console.warn("身份证格式不正确！！！");
        }
        return this.$ID;
    }
    checkPass(v) {
        let value = v ? v : this.$form.password;
        this.#pass1 = value;
        let reg = /^\d{6}$/;
        if (reg.test(value)) {
            this.$pass = true;
        } else {
            this.$pass = false;
            console.warn("只能输入六位数字！！！");
        }
        return this.$pass;
    }
    checkPassAgain(v) {
        let value = v ? v : this.$form.checksPassword;
        this.#pass2 = value;
        if (this.#pass1 === this.#pass2) {
            this.$passAgain = true;
        } else {
            console.warn("两次密码不一致！！！");
        }
        return this.$passAgain;
    }
    valid() {
        this.$valid = this.$name & this.$ID & this.$pass & this.$passAgain;
        if (!this.$valid) {
            console.warn("表单校验不通过");
        }
        return this.$valid
    }
    submit(){
        this.checkName();
        this.checkID();
        this.checkPass();
        this.checkPassAgain();
        return this.valid()
    }

    /**
     * 开户页面的校验
     */
    checkCardID(v){
        let value = v?v:this.$form.cardID;
        let reg = /^([1-9]{1})(\d{15}|\d{18})$/;
        if(reg.test(value)){
            this.$cardID = true;
        }else{
            console.warn("银行卡号格式不正确！！！");
        }
    }
    checkPhoneNumber(v){
        let value = v?v:this.$form.phoneNumber;
        let reg = /^1[3-9]\d{9}$/;
        if(reg.test(value)){
            this.$phoneNumber = true;
        }else{
            console.warn("请输入正确的手机号！！！");
        }
    }
}

export default CheckForm