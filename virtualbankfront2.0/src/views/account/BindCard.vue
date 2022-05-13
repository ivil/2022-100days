<template>
  <div id="bindCard">
    <acc-navigation2 :title="title" />
    <!-- <h3>请绑定持卡人本人的银行卡</h3> -->
    <div class="pic">
      <img :src="bindHead" alt="" />
      <!-- <lottie
        :options="defaultOptions"
        :height="150"
        :width="370"
        v-on:animCreated="handleAnimation"
      /> -->
    </div>

    <div class="main">
      <!------ 信息列表 ------>
      <div class="form1">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <!-- 持卡人 -->
          <el-form-item prop="username">
            <el-input type="text" :placeholder="username" :disabled="true">
              <template slot="prepend">持卡人</template>
            </el-input>
          </el-form-item>
          <!-- 银行卡号 -->
          <el-form-item prop="cardNum">
            <el-input
              type="number"
              placeholder="请输入要绑卡的银行卡号"
              v-model="ruleForm.cardNum"
            >
              <template slot="prepend">银行卡号</template>
            </el-input>
          </el-form-item>
          <!-- 预留手机号 -->
          <el-form-item prop="registerPhone">
            <el-input
              type="tel"
              v-model="ruleForm.registerPhone"
              readonly
              maxlength="11"
            >
              <template slot="prepend">预留手机号</template>
            </el-input>
          </el-form-item>
          <!-- 短信验证码 -->
          <el-form-item prop="code">
            <el-input
              placeholder="请输入6位验证码"
              v-model="ruleForm.code"
              maxlength="6"
            >
              <template slot="prepend">验证码</template>
              <p slot="append" @click="sendCode">{{ sendCode1 }}</p>
            </el-input>
          </el-form-item>
          <!-- 图形验证码 -->
          <el-form-item prop="imgCode">
            <el-input
              type="text"
              placeholder="请输入图形验证码"
              v-model="ruleForm.imgCode"
            >
              <template slot="prepend">图形验证码</template>
              <template slot="append"
                ><img :src="imgCode1" alt="图形验证码" @click="getImgCode"
              /></template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="submitForm">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

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
import { encrypt } from "../../utils/AES";
import {
  bindCardSubmit,
  bindCardCode,
  captcha,
  getAdvancePhone,
} from "../../api/api";
import AccNavigation2 from "../../components/AccNavigation2.vue";
import * as animationData from "../../assets/jsonLogo/bindcard.json";
// vant组件
import { Toast } from "vant";
export default {
  name: "BindCard",
  components: {
    AccNavigation2,
  },
  data() {
    // 银行卡号
    var validateCardNum = (rule, value, callback) => {
      let cardNum_pattern = /^([1-9]{1})(\d{15}|\d{18})$/;
      if (value === "") {
        callback(new Error("*银行卡号不为空"));
      } else if (cardNum_pattern.test(value)) {
        getAdvancePhone(value).then(
          (value) => {
            console.log(value);
            if (value.code === 200) {
              this.registerPhone = value.data;
              this.ruleForm.registerPhone =
                value.data.substring(0, 3) +
                "****" +
                value.data.substring(value.data.length - 4);
            }
          },
          (reason) => {
            console.log(reason);
          }
        );
        callback();
      } else {
        callback(new Error("银行卡号格式错误!"));
      }
    };
    // // 手机号正则验证
    // let validateRegisterPhone = (rule, value, callback) => {
    //   let phone_pattern = /^1[3-9]\d{9}$/;
    //   if (value === "") {
    //     callback(new Error("*手机号不为空"));
    //   } else if (phone_pattern.test(value)) {
    //     callback();
    //   } else {
    //     callback(new Error("请输入正确的手机号!"));
    //   }
    // };
    // 短信验证码
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*验证码不为空"));
      } else {
        callback();
      }
    };
    // 图形验证码
    var validateImgCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*图形验证码不为空"));
      } else {
        callback();
      }
    };
    return {
      bindHead:require('@/assets/card/bindHead.png'),
      // json动图
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 1,
      anim: {},
      // 密码框
      value: "",
      isShow: false, //密码输入框默认隐藏
      maskShow: false, //遮罩层默认隐藏
      showKeyboard: true,

      title: "绑卡",
      username: "",
      // captcha: "/code/getGraphCode?imageId=" + Math.random(),
      // sendPhoneCode: "发送验证码",
      // checkThisForm: "",
      // time: 59,
      registerPhone: "",
      ruleForm: {
        //表单输入的值
        cardNum: "",
        registerPhone: "",
        code: "",
        imgCode: "",
      },
      rules: {
        // 表单失焦验证
        cardNum: [{ validator: validateCardNum, trigger: "blur" }],
        // registerPhone: [{ validator: validateRegisterPhone, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
        imgCode: [{ validator: validateImgCode, trigger: "blur" }],
      },
      sendCode1: "发送验证码",
      time: 59, //发送验证码倒计时
      imgCode1: captcha + Math.random(), //获取图形验证码
      hasSendCode: false,
      // bindCardForm: {
      //   username: JSON.parse(sessionStorage.getItem("user")).username,
      //   cardID: "5462121212121212",
      //   phoneNumber: "17766669999",
      //   phoneCode: "123456",
      //   payPassword: "123456",
      //   captchaCode: "ivil",
      // },
    };
  },
  methods: {
    // json动图
    handleAnimation: function (anim) {
      this.anim = anim;
      console.log(anim); //这里可以看到 lottie 对象的全部属性
    },
    // 发送短信验证码（60秒倒计时）
    sendCode(e) {
      if (this.ruleForm.registerPhone != "") {
        this.hasSendCode = true;
        if (e.target.innerHTML !== "发送验证码") {
          return;
        } else {
          let mobilePhone = this.registerPhone;
          // 发送mobilePhone请求
          bindCardCode(mobilePhone).then(
            (value) => {
              console.log(value);
              if (value.code === 200) {
                Toast.success(value.message); //vant提示
                this.sendCode1 = "60秒";
                let timer = setInterval(() => {
                  this.sendCode1 = this.time + "秒";
                  this.time--;
                  if (this.time < 0) {
                    clearInterval(timer);
                    this.sendCode1 = "发送验证码";
                    this.time = 59;
                  }
                }, 1000);
              } else {
                Toast.fail(value.message);
              }
            },
            (reason) => {
              console.log(reason);
            }
          );
        }
      } else {
        Toast("请先输入手机号！");
      }
    },

    // 点击遮罩层时，隐藏密码输入框
    clickMask() {
      this.isShow = false;
      this.maskShow = false;
      this.value = "";
    },

    // 点击图形验证码，再次请求数据
    getImgCode() {
      this.imgCode1 = captcha + Math.random();
    },
    // 点击确定时，提交数据给后端
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.isShow = true;
          this.maskShow = true;
        } else {
          return false;
        }
      });
    },
    // 密码输入完成
    finish() {
      this.isShow = false;
      this.maskShow = false;
      // 发送axios请求
      let imgCode1 = this.imgCode1.split("=");
      let data = {
        userId: JSON.parse(sessionStorage.getItem("user")).id,
        accountId: this.ruleForm.cardNum,
        mobilePhone: this.registerPhone,
        phoneCode: this.ruleForm.code,
        captcha: this.ruleForm.imgCode,
        payPassword: encrypt((this.value).substring(0, 6)), //密码加密
        imageId: imgCode1[1],
      };
      console.log(data);
      bindCardSubmit(data).then((value) => {
        if (value.code === 200) {
          // 更新缓存
          sessionStorage.setItem("user", JSON.stringify(value.data));
          this.$confirm("绑卡成功！是否继续绑卡?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(() => {
              window.location.reload();
              this.$router.push({ name: "/" });
            })
            .catch(() => {
              // 点击取消时，跳到首页
              this.$router.replace("/");
            });
        } else if (value.code === 500) {
          this.value = "";
          // 显示错误
          Toast.fail(value.message);
        }
      });
    },
  },

  mounted() {
    // 从缓存中获取用户名
    try {
      this.username = JSON.parse(sessionStorage.getItem("user")).username;
    } catch (e) {}
  },
};
</script>

<style lang="less" scoped>
.pic {
  // width: 100%;
  // height: 150px;
  img {
    width: 100%;
  }
}

#bindCard {
  background: #f5f5f5;
  width: 100%;
  // height: auto;
  height: 100%;
  position: fixed;
  h3 {
    margin-top: 30px;
    font-size: 20px;
    font-weight: 500;
  }
  .main {
    // margin-top: 30px;
    .form1 {
      .border() {
        border: none;
        font-size: 16px;
        color: #000;
      }
      /deep/.el-input {
        padding: 15px 0px;
        background: #fff;
      }
      /deep/.el-input.is-disabled .el-input__inner {
        background: #fff;
      }
      /deep/.el-form-item {
        margin-bottom: 2px;
      }
      /deep/.el-input-group__prepend {
        .border();
        background-color: #fff;
        padding: 0px 15px;
      }
      /deep/.el-input__inner {
        .border();
        padding-top: 2px;
        text-align: right;
      }
      /deep/.el-form-item__content {
        line-height: 0px;
      }
      /deep/.el-form-item__error {
        left: 36%;
        top: 67%;
      }
      /deep/.el-input-group__append {
        .border();
        background-color: #fff;
        padding: 0px 15px 0px 0px;
      }
      /deep/.el-button {
        padding: 0px;
        margin: 0px;
        background: #546ffe;
        color: #fff;
        width: 90%;
        height: 45px;
        margin-top: 20px;
        font-size: 16px;
        box-shadow: 0px 0px 12px #bbb;
      }
      p {
        width: 120px;
        height: 40px;
        line-height: 40px;
        color: #3c7ec4;
        text-align: right;
      }
      img {
        height: 36px;
      }
    }
  }
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
/* messageBox弹框的样式 */
.el-message-box {
  width: 340px !important;
}
.el-button--primary {
  background-color: #5684ff !important;
  border-color: #5684ff !important;
}
</style>