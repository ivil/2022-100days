<template>
  <div class="back">
    <acc-navigation :title="title" />
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <!-----------------赎回份数  -------------------------->
      <div class="middle">
        <div class="money">
          <el-form-item label="份 数:" prop="amount">
            <el-input
              type="number"
              v-model="ruleForm.amount"
              autocomplete="off"
            >
            </el-input>
            <p @click="allIn" class="allIn">全部赎回</p>
          </el-form-item>
          <!-------------------手机号码 ------------------------->
          <div class="phone">
            <p>手机号:</p>
            <input type="tel" v-model="registerPhone" readonly />
            <p @click="sendCode1">{{ sendCode }}</p>
          </div>
          <!-------------------- 手机验证码   -------------------->
          <el-form-item label="验证码:" prop="code">
            <el-input
              type="number"
              v-model="ruleForm.code"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </div>

        <div class="list">
          <ul>
            <li>
              <p>本次最多可赎回份数</p>
              <p>{{ amount }}份</p>
            </li>
            <li>
              <p>本次最多可赎回到电子账户</p>
              <p>{{ ruleForm.backMoney | formatMoney1 }}元</p>
            </li>
            <li>
              <p>收款账户:电子账户</p>
            </li>
          </ul>
        </div>
        <div class="tip">
          <h3>温馨提示</h3>
          <p>1、我行代销理财产品存在投资风险。</p>
          <p>2、根据理财产品交易规则，交易日不含法定节假日、周末。</p>
        </div>
      </div>
      <!--  -->
      <div class="footer">
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确认赎回</el-button
        >
      </div>
    </el-form>

    <!-- 遮罩层 -->
    <div class="mask" v-show="maskShow" @click="clickMask"></div>
    <!-- 密码输入框 -->
    <div class="password" v-show="isShow">
      <p>请输入支付密码</p>
      <van-password-input
        class="input"
        :value="value"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
        v-show="isShow"
      />
    </div>

    <!-- 数字键盘 -->
    <van-number-keyboard
      :show="showKeyboard"
      random-key-order
      close-button-text="完成"
      @blur="showKeyboard = false"
      @close="finish"
      v-show="isShow"
      v-model="value"
    />
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { backFinance, getPhoneCode } from "../../api/api";
import { encrypt } from "../../utils/AES";
import { Toast } from "vant";

export default {
  name: "Back",
  components: {
    AccNavigation,
  },
  data() {
    //输入金额
    var validateMoney = (rule, value, callback) => {
      // let money = /^ $/;
      if (value === "") {
        callback(new Error("请输入赎回份数"));
      } else if (value > this.ruleForm.backMoney) {
        callback(new Error("赎回份额不足,请重新输入"));
      } else {
        callback();
      }
    };

    //手机验证码
    var validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机验证码不能为空"));
      } else {
        callback();
      }
    };

    return {
      title: "产品赎回",
      ruleForm: {
        amount: "", //份数
        code: "", //验证码
        backMoney: this.$store.state.singleAssets, //获取vuex
        // backMoney:100,
      },
      rules: {
        amount: [{ validator: validateMoney, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
      },
      sendCode: "发送验证码",
      time: 59, //发送验证码倒计时
      registerPhone: "",
      isShow: false, //密码输入框默认隐藏
      maskShow: false, //遮罩层默认隐藏
      value: "", //输入的密码
      showKeyboard: true,
      amount: this.$route.query.amount,
    };
  },

  methods: {
    allIn() {
      this.ruleForm.amount = this.$route.query.amount;
    },
    // 点击遮罩层时，隐藏密码输入框
    clickMask() {
      this.isShow = false;
      this.maskShow = false;
      this.value = "";
    },

    // 发送手机验证码
    sendCode1(e) {
      if (e.target.innerHTML !== "发送验证码") {
        return;
      }
      if (this.time === 59) {
        let data = {
          mobilePhone: JSON.parse(sessionStorage.getItem("user")).mobilePhone,
        };
        getPhoneCode(data).then(
          (value) => {
            console.log(value);
            if (value.code === 200) {
              console.log(value);
              Toast.success(value.message);
            } else {
              Toast.fail(value.message);
            }
          },
          (reason) => {
            console.log(reason);
          }
        );
        this.sendCode = "60秒";
        let timer = setInterval(() => {
          this.time--;
          this.sendCode = this.time + 1 + "秒";
          if (this.time < 0) {
            clearInterval(timer);
            this.sendCode = "发送验证码";
            this.time = 59;
          }
        }, 1000);
      } else {
        return;
      }
    },

    //确认赎回提交信息到后端
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isShow = true;
          this.maskShow = true;
        } else {
          //表单验证不通过
          return false;
        }
      });
    },
    //密码输入完成
    finish() {
      this.isShow = false;
      this.maskShow = false;
      // this.value = "";
      let data = {
        userId: JSON.parse(sessionStorage.getItem("user")).id,
        financeRecordId: JSON.parse(sessionStorage.getItem("hodeFinance"))[
          this.$route.query.index
        ].id,
        mobilePhone: JSON.parse(sessionStorage.getItem("user")).mobilePhone,
        phoneCode: this.ruleForm.code,
        amount: this.ruleForm.amount,
        payPassword: encrypt((this.value).substring(0, 6)), //密码加密
      };
      console.log(data);
      backFinance(data).then((value) => {
        console.log(value);
        if (value.code === 200) {
          console.log("123456789");
          // 更新缓存（金额）
          let tempdata = JSON.parse(sessionStorage.getItem("user"));
          tempdata.money = value.data.money;
          sessionStorage.setItem("user", JSON.stringify(tempdata));

          // 支付成功跳转页面，将获取赎回信息到赎回提示页
          let temp = JSON.stringify({
            getMessage: value.message,
            money: value.data.price,
            productName: JSON.parse(sessionStorage.getItem("hodeFinance"))[
              this.$route.query.index
            ].name,
          });
          this.$router.replace({ name: "BackSuccess", query: temp });
        } else if (value.code === 500) {
          this.value = "";
          Toast.fail(value.message);
        }
      });
    },
  },

  mounted() {
    // 接收
    backFinance().then((value) => {
      if (value.code === 200) {
        console.log(value);
        this.ruleForm.backMoney = element.amount * price;
      }
    });
  },
  created() {
    // 从缓存获取手机号
    let tempPhone = JSON.parse(sessionStorage.getItem("user")).mobilePhone;
    console.log(tempPhone);
    this.registerPhone =
      tempPhone.substring(0, 3) +
      "****" +
      tempPhone.substring(tempPhone.length - 4);
    console.log(this.registerPhone);
  },
};
</script>

<style lang="less" scoped>
.flex() {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.middle {
  width: 90%;
  padding: 0 5%;
  margin-top: 20px;
}
.money {
  width: 100%;
  height: 70px;
}
/deep/.el-form-item__label {
  font-size: 18px;
  text-align: left;
  letter-spacing: 2px;
  margin-top: 10px;
}
/deep/.el-input__inner {
  height: 45px;
  font-size: 18px;
  border: none;
  outline: medium;
  border-bottom: 1px solid #999;
  border-radius: 0px;
  width: 270px;
  margin-left: -30px;
}
.allIn {
  background: #5684ff;
  color: #fff;
  height: 30px;
  width: 65px;
  line-height: 30px;
  border-radius: 5px;
  position: relative;
  bottom: 35px;
  right: -175px;
}
.phone {
  width: 100%;
  height: 40px;
  margin-top: -15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  padding: 0px 0px 10px 0px;
  input {
    height: 30px;
    outline: medium;
    border: 1px solid #999;
    font-size: 18px;
    width: 150px;
    text-indent: 5px;
  }
  p {
    &:nth-of-type(2) {
      width: 100px;
      height: 30px;
      border: 1px solid #999;
      line-height: 30px;
    }
  }
}
.list {
  ul {
    width: 100%;
    margin-top: 130px;
    li {
      width: 100%;
      height: 40px;
      margin-top: 5px;
      .flex();
      p {
        font-size: 18px;
        color: rgb(109, 108, 108);
        &:nth-child(2) {
          color: red;
        }
      }
    }
  }
}
.tip {
  width: 100%;
  margin-top: 20px;
  text-align: left;
  p {
    font-size: 18px;
    color: #999;
    margin: 12px 0 0px 0;
  }
}
/deep/.el-button {
  width: 340px;
  height: 60px;
  left: 0;
  right: 0;
  bottom: 30px;
  margin: auto;
  position: absolute;
  font-size: 20px;
  letter-spacing: 3px;
}
/deep/.el-button--primary {
  background: #5684ff !important;
  border: none;
}

// 密码框
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}
.password {
  bottom: 340px;
  width: 310px;
  background: #fff;
  border-radius: 5px;
  height: 150px;
  left: 0;
  right: 0;
  margin: auto;
  position: absolute;
  line-height: 70px;
  p {
    font-size: 18px;
    color: #000;
    font-weight: 700;
  }
  input {
    width: 280px;
    height: 40px;
    font-size: 24px;
    text-align: center;
    letter-spacing: 8px;
    border: 1px solid #999;
  }
}
.input {
  // width: 277px;
  height: 36.34px;
}
/deep/.van-password-input__security li {
  background: rgb(230, 228, 228);
  margin: 0 5px;
}
/deep/.van-number-keyboard__close {
  font-size: 18px;
  color: #5684ff;
}
</style>