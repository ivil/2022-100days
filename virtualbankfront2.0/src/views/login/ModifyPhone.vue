<template>
  <div id="modifyPhone">
    <acc-navigation :title="title" />
    <div class="main">
      <!------ 信息列表 ------>
      <div class="form1">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <!-- 注册手机号 -->
          <el-form-item prop="registerPhone">
            <el-input
              type="tel"
              :placeholder="registerPhone"
              v-model="ruleForm.registerPhone"
              maxlength="11"
              :disabled="true"
            >
              <template slot="prepend">注册手机号</template>
            </el-input>
          </el-form-item>
          <!-- 当前手机号 -->
          <el-form-item prop="nowPhone">
            <el-input
              type="tel"
              placeholder="请输入当前手机号"
              v-model="ruleForm.nowPhone"
              maxlength="11"
            >
              <template slot="prepend">当前手机号</template>
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
          <el-form-item>
            <el-button @click="submitForm">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { upPhone, getPhoneCode } from "../../api/api";
import { Toast } from "vant";
export default {
  name: "ModifyPhone",
  components: {
    AccNavigation,
  },
  data() {
    // 手机号正则验证
    let validateNowPhone = (rule, value, callback) => {
      let phone_pattern = /^1[3-9]\d{9}$/;
      if (value === "") {
        callback(new Error("*手机号不为空"));
      } else if (value === this.registerPhone) {
        callback(new Error("该手机号与注册手机号一致!"));
      } else if (phone_pattern.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号!"));
      }
    };
    // 短信验证码
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*验证码不为空"));
      } else {
        callback();
      }
    };
    return {
      title: "修改手机号",
      registerPhone: "", //注册手机号，不可修改
      ruleForm: {
        //表单输入的值
        nowPhone: "",
        code: "",
      },
      rules: {
        // 表单失焦验证
        nowPhone: [{ validator: validateNowPhone, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
      },
      sendCode1: "发送验证码",
      time: 59, //发送验证码倒计时
    };
  },
  mounted() {
    // 脱敏显示手机号
    let mobilePhone =
      JSON.parse(sessionStorage.getItem("user")).mobilePhone || "";
    this.registerPhone =
      mobilePhone.substring(0, 3) +
      "****" +
      mobilePhone.substring(mobilePhone.length - 4);
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
              // 显示错误
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
        console.log(valid);
        if (valid) {
          // 发送axios请求
          let data = {
            userId: JSON.parse(sessionStorage.getItem("user")).userId,
            oldMobilePhone: JSON.parse(sessionStorage.getItem("user"))
              .mobilePhone,
            newMobilePhone: this.ruleForm.nowPhone,
            phoneCode: this.ruleForm.code,
          };
          upPhone(data).then(
            (value) => {
              console.log(value);
              if (value.code === 200) {
                // 将用户信息存进缓存（更新缓存）
                sessionStorage.setItem("user", JSON.stringify(value.data));
                // 提示：手机号修改成功
                Toast.success("恭喜你，手机号修改成功！");
                // 修改成功之后，跳转到基本信息页面
                setTimeout(() => {
                  this.$router.push("/information");
                }, 1500);
              } else if (value.code === 500) {
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
};
</script>

<style lang="less" scoped>
#modifyPhone {
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