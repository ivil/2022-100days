<template>
  <div id="modifyPayPass">
    <acc-navigation2 :title="title" />
    <div class="main">
      <!------ 表单 ------>
      <div class="form1">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <!-- 手机号 -->
          <el-form-item prop="registerPhone">
            <el-input
              type="tel"
              :placeholder="registerPhone"
              v-model="ruleForm.registerPhone"
              maxlength="11"
              :disabled="true"
            >
              <template slot="prepend">手机号</template>
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
          <!-- 支付密码 -->
          <el-form-item prop="pass">
            <el-input
              type="password"
              placeholder="请输入6位数字支付密码"
              v-model="ruleForm.pass"
              maxlength="6"
            >
              <template slot="prepend">支付密码</template>
            </el-input>
          </el-form-item>
          <!-- 确认支付密码 -->
          <el-form-item prop="checkPass">
            <el-input
              type="password"
              placeholder="请输入确认支付密码"
              v-model="ruleForm.checkPass"
              maxlength="6"
            >
              <template slot="prepend">确认支付密码</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template> 

<script>
import AccNavigation2 from "../../components/AccNavigation2.vue";
import { upPayPass, getPhoneCode } from "../../api/api";
import { encrypt } from "../../utils/AES";
import { Toast } from "vant";
export default {
  name: "ModifyPayPass",
  components: {
    AccNavigation2,
  },
  data() {
    // 短信验证码
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*验证码不为空"));
      } else {
        callback();
      }
    };
    // 支付密码
    let validatePass = (rule, value, callback) => {
      let pass_pattern = /^\d{6}$/;
      if (value === "") {
        callback(new Error("*支付密码不为空"));
      } else if (pass_pattern.test(value)) {
        callback();
      } else {
        callback(new Error("请输入6位数字支付密码!"));
      }
    };
    // 判断确认支付密码是否与支付密码一致
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*确认密码不为空"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      title: "修改支付密码",
      registerPhone: "", //注册手机号，不可修改
      ruleForm: {
        //表单输入的值
        code: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        // 表单失焦验证
        code: [{ validator: validateCode, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
      sendCode1: "发送验证码",
      time: 59, //发送验证码倒计时
    };
  },
  methods: {
    // 返回上一步
    back() {
      this.$router.go(-1);
    },
    // 发送短信验证码（60秒倒计时）
    sendCode(e) {
      if (e.target.innerHTML !== "发送验证码") {
        return;
      } else {
        let data = {
          mobilePhone: JSON.parse(sessionStorage.getItem("user")).mobilePhone,
          type: "",
        };
        getPhoneCode(data).then(
          (value) => {
            if (value.code === 500) {
              Toast.fail(value.message);
            } else {
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
            }
          },
          (reason) => {
            console.log(reason);
          }
        );
      }
    },
    // 点击确定时，提交数据给后端
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          //发送axios请求
          let data = {
            userId: JSON.parse(sessionStorage.getItem("user")).id,
            mobilePhone: JSON.parse(sessionStorage.getItem("user")).mobilePhone,
            phoneCode: this.ruleForm.code,
            newPayPassword: encrypt(this.ruleForm.pass),
          };
          upPayPass(data).then(
            (value) => {
              console.log(value);
              if (value.code === 200) {
                // 提示：支付密码修改成功
                Toast.success(value.message);
                this.$router.go(-1);
              } else if (value.code === 500) {
                // 显示错误
                Toast.fail(value.message);
              }
            },
            (reason) => {
              console.log(reason);
            }
          );
        } else {
          //表单验证不通过
          return false;
        }
      });
    },
  },

  // 数据加载时
  mounted() {
    // 脱敏显示手机号
    let mobilePhone =
      JSON.parse(sessionStorage.getItem("user")).mobilePhone || "";
    this.registerPhone =
      mobilePhone.substring(0, 3) +
      "****" +
      mobilePhone.substring(mobilePhone.length - 4);
  },
};
</script>

<style lang="less" scoped>
#modifyPayPass {
  background: #f5f5f5;
  width: 100%;
  height: 100%;
  position: fixed;
  .main {
    margin-top: 20px;
    .form1 {
      .border() {
        border: none;
        font-size: 16px;
        color: #000;
      }
      /deep/.el-input {
        padding: 10px 0px;
        background: #fff;
      }
      /deep/.el-input.is-disabled .el-input__inner {
        background: #fff;
      }
      /deep/.el-form-item {
        margin-bottom: 1px;
      }
      /deep/.el-input-group__prepend {
        .border();
        background-color: #fff;
        padding: 0px 15px;
      }
      /deep/.el-input__inner {
        .border();
        padding-top: 2px;
      }
      /deep/.el-form-item__content {
        line-height: 0px;
      }
      /deep/.el-form-item__error {
        left: 36%;
        top: 68%;
      }
      /deep/.el-input-group__append {
        .border();
        background-color: #fff;
        padding: 0px 15px 0px 0px;
      }
      /deep/.el-button {
        padding: 0px;
        margin: 0px;
        background: #5684ff;
        color: #fff;
        width: 70%;
        height: 45px;
        margin-top: 30px;
        font-size: 16px;
      }
      p {
        width: 120px;
        height: 40px;
        line-height: 40px;
        color: #5684ff;
        text-align: right;
      }
    }
  }
}
@font-face {
  font-family: "iconfont"; /* Project id 3184220 */
  src: url("//at.alicdn.com/t/font_3184220_54zjcig078o.woff2?t=1645155582274")
      format("woff2"),
    url("//at.alicdn.com/t/font_3184220_54zjcig078o.woff?t=1645155582274")
      format("woff"),
    url("//at.alicdn.com/t/font_3184220_54zjcig078o.ttf?t=1645155582274")
      format("truetype");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 20px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>