<template>
  <div id="modifySignPass">
    <acc-navigation :title="title" />
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
          <el-form-item prop="phone">
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
          <!-- 修改密码 -->
          <el-form-item prop="newPass">
            <el-input
              type="password"
              placeholder="密码8-16位，字母数字字符组合"
              v-model="ruleForm.newPass"
              maxlength="16"
            >
              <template slot="prepend">修改密码</template>
              <!-- 密码强度 -->
              <template slot="append" v-if="showStrong" class="passStrong">{{
                strong
              }}</template>
            </el-input>
          </el-form-item>
          <!-- 确认密码 -->
          <el-form-item prop="checkPass">
            <el-input
              type="password"
              placeholder="请输入确认密码"
              v-model="ruleForm.checkPass"
              maxlength="16"
            >
              <template slot="prepend">确认密码</template>
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
import { getPhoneCode, upSignPass } from "../../api/api";
import { encrypt } from "../../utils/AES";
import { Toast } from "vant";
export default {
  name: "ModifySignPass",
  components: {
    AccNavigation,
  },
  data() {
    // 短信验证码
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*验证码不为空"));
      } else {
        callback();
      }
    };
    // 修改密码
    let validateNewPass = (rule, value, callback) => {
      let password_pattern = /^[\W\w]{8,16}$/;
      // 对输入的每一个字符类型进行判断，以实现密码强度验证
      let num = false;
      let digtal = false;
      let digtal1 = false;
      let digtal2 = false;
      let str = false;
      let num_pattern = /\d/;
      let digtal_pattern = /[a-zA-Z]/;
      let digtal1_pattern = /[A-Z]/;
      let digtal2_pattern = /[a-z]/;
      let str_pattern = /\W|[_]/;
      let arr = value.split("");
      arr.forEach((element) => {
        if (num_pattern.test(element)) {
          num = true; //数字
        }
        if (digtal_pattern.test(element)) {
          digtal = true; //字母
        }
        if (digtal1_pattern.test(element)) {
          digtal1 = true; //大写字母
        }
        if (digtal2_pattern.test(element)) {
          digtal2 = true; //小写字母
        }
        if (str_pattern.test(element)) {
          str = true; //字符
        }
      });
      if (value === "") {
        callback(new Error("*密码不为空"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        if (
          password_pattern.test(value) &&
          ((num && digtal) ||
            (num && str) ||
            (digtal && str) ||
            (num && digtal && str))
        ) {
          this.showStrong = true;
          callback();
        } else if (
          !(
            (num && digtal) ||
            (num && str) ||
            (digtal && str) ||
            (num && digtal && str)
          )
        ) {
          this.showStrong = false;
          callback(new Error("密码需字母、数字、字符至少两种"));
        } else if (value.split("").length < 8 || value.split("").length > 16) {
          this.showStrong = false;
          callback(new Error("密码位数错误, 需为8-16位"));
        }
        // 密码强中弱
        // 强
        if (num && digtal && str) {
          this.passStrong = 100;
          this.strong = "强";
          return;
        }
        //  中
        if ((digtal1 && digtal2 && num) || (digtal1 && digtal2 && str)) {
          this.passStrong = 66;
          this.strong = "中";
          return;
        }
        // 弱
        if ((num && digtal) || (num && str) || (digtal && str)) {
          this.passStrong = 33;
          this.strong = "弱";
        }
      }
    };
    // 判断确认密码是否与修改密码一致
    let validatecheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*确认密码不为空"));
      } else if (value !== this.ruleForm.newPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      title: "修改登录密码",
      registerPhone: "", //注册手机号，不可修改
      ruleForm: {
        //表单输入的值
        code: "",
        newPass: "",
        checkPass: "",
      },
      rules: {
        // 表单失焦验证
        code: [{ validator: validateCode, trigger: "blur" }],
        newPass: [{ validator: validateNewPass, trigger: "blur" }],
        checkPass: [{ validator: validatecheckPass, trigger: "blur" }],
      },
      showStrong: false, //密码强度显示
      strong: "",
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
        console.log(data);
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
          //发送axios请求
          let data = {
            userId: JSON.parse(sessionStorage.getItem("user")).id,
            mobilePhone: JSON.parse(sessionStorage.getItem("user")).mobilePhone,
            newPassword: encrypt(this.ruleForm.newPass),
            phoneCode: this.ruleForm.code,
          };
          upSignPass(data).then(
            (value) => {
              console.log(value);
              if (value.code === 200) {
                // 提示：登录密码修改成功，跳转去登录页面
                this.$alert("密码修改成功，请重新登录", "提示", {
                  confirmButtonText: "确定",
                  type: "primary",
                })
                  .then(() => {
                    this.$router.push("/passSign");
                  })
                  .catch(() => {});
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
#modifySignPass {
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
        color: #454545;
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
        color: #5684ff;
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