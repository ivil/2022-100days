<template>
  <div id="PassSign">
    <acc-navigation2 :title="title" />
    <div class="logo">
      <img :src="logo" alt="" />
    </div>
    <!------------------ 登录表单 ------------------>
    <div class="form1">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <!----- 手机号 ------->
        <el-form-item prop="phone">
          <el-input
            type="tel"
            placeholder="请输入11位手机号"
            v-model="ruleForm.phone"
            maxlength="11"
          >
            <template slot="prepend"><i class="iconfont">&#xe627;</i></template>
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="pass">
          <el-input
            type="password"
            placeholder="请输入登录密码"
            v-model="ruleForm.pass"
            maxlength="16"
          >
            <template slot="prepend"><i class="iconfont">&#xe619;</i></template>
            <el-button slot="append" @click="forgetPass">忘记密码?</el-button>
          </el-input>
        </el-form-item>
        <!-- 图形验证码 -->
        <el-form-item prop="code">
          <el-input
            type="text"
            placeholder="请输入图形验证码"
            v-model="ruleForm.code"
          >
            <template slot="prepend"><i class="iconfont">&#xe799;</i></template>
            <template slot="append"
              ><img :src="imgCode" alt="图形验证码" @click="getImgCode"
            /></template>
          </el-input>
        </el-form-item>
        <br />
        <el-form-item>
          <el-button @click="submitForm" class="login">登录</el-button>
          <el-button @click="register" class="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <br />
    <!-- 阅读条款 -->
    <div class="clause">
      <el-checkbox v-model="checked"></el-checkbox>
      已阅读并同意<span>《中国雄鸡银行相关条款》</span>
    </div>
    <br />
    <div class="phoneCodeSign" @click="phoneCodeSign">短信验证码登录</div>
  </div>
</template>

<script>
import AccNavigation2 from "../../components/AccNavigation2.vue";
import { login, captcha } from "../../api/api";
import { encrypt } from "../../utils/AES";
import { Toast } from "vant";
export default {
  name: "PassSign",
  components: {
    AccNavigation2,
  },
  data() {
    // 手机号正则验证
    let validatePhone = (rule, value, callback) => {
      let phone_pattern = /^1[3-9]\d{9}$/;
      if (value === "") {
        callback(new Error("*手机号不为空"));
      } else if (phone_pattern.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号!"));
      }
    };
    // 密码
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*密码不为空"));
      } else {
        callback();
      }
    };
    // 图形验证码
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*图形验证码不为空"));
      } else {
        callback();
      }
    };
    return {
      title: "登录",
      logo: require("@/assets/me/login/logo.png"), //银行logo
      ruleForm: {
        //表单输入的值
        phone: "",
        pass: "",
        code: "",
      },
      rules: {
        // 表单失焦验证
        phone: [{ validator: validatePhone, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
      },
      imgCode: captcha + Math.random(), //获取图形验证码
      checked: false, //默认不选阅读条款
    };
  },
  methods: {
    // 返回上一步
    back() {
      this.$router.go(-1);
    },
    // 跳转到忘记密码页面
    forgetPass() {
      this.$router.push("/forgetPass");
    },
    // 点击图形验证码，再次请求数据
    getImgCode() {
      this.imgCode = captcha + Math.random();
    },
    // 点击登录时，提交数据给后端
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          console.log(valid);
          if (this.checked === false) {
            Toast.fail('请先勾选协议！');
            return;
          }
          // 表单验证通过，发送axios请求
          let imgCode = this.imgCode.split("=");
          let data = {
            mobilePhone: this.ruleForm.phone,
            password: encrypt(this.ruleForm.pass), //加密
            captcha: this.ruleForm.code,
            imageId: imgCode[1],
          };
          this.getImgCode();
          login(data).then(
            (value) => {
              console.log(value);
              if (value.code === 200) {
                // cookie是以键值对的形式保存的，即key=value的格式
                document.cookie = "token=" + value.data.password;
                sessionStorage.setItem("token", value.data.password);
                sessionStorage.setItem("user", JSON.stringify(value.data));
                // 如果没开户就提示是否前往开户页面
                if (
                  value.data.accountId === null ||
                  value.data.accountId === ""
                ) {
                  this.$confirm("您还未开户！是否前往开户?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                  })
                    .then(() => {
                      //点击确定时，跳转到开户页面
                      this.$router.push("/openAccount");
                    })
                    .catch((e) => {
                      //点击取消时，跳转到首页
                      if (e === "cancel") this.$router.push("/");
                    });
                } else {
                  // 如果已开户没绑卡就提示是否前往绑卡页面
                  if (value.data.bankCardCount === "0") {
                    this.$confirm("您还未绑卡！是否前往绑卡?", "提示", {
                      confirmButtonText: "确定",
                      cancelButtonText: "取消",
                    })
                      .then(() => {
                        //点击确定时，跳转到绑卡页面
                        this.$router.push("/bindCard");
                      })
                      .catch((e) => {
                        if (e === "cancel") {
                          this.$router.push("/");
                        }
                      });
                  } else {
                    setTimeout(() => {
                      this.$router.push("/");
                    }, 300);
                    Toast.success('登录成功！');
                  }
                }
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
    // 跳转至注册页面
    register() {
      this.$router.push("/register");
    },
    // 跳转至短信验证码登录
    phoneCodeSign() {
      this.$router.push("/phoneCodeSign");
    },
  },
};
</script>

<style lang="less" scoped>
.logo {
  padding: 30px 0px;
  img {
    width: 230px;
  }
}
.form1 {
  .border() {
    border: none;
    font-size: 18px;
  }
  /deep/.el-input-group__prepend {
    .border();
    background-color: #fff;
    padding: 0px 15px;
  }
  /deep/.el-input__inner {
    border: none;
    font-size: 16px;
    margin-top: -2px;
    padding: 0px 5px;
  }
  /deep/.el-form-item__content {
    line-height: 0px;
  }
  /deep/.el-form-item__error {
    left: 15%;
  }
  /deep/.el-input-group__append {
    .border();
    background-color: #fff;
    padding: 0px 15px 0px 0px;
  }
  /deep/.el-button {
    width: 100px;
    height: 35px;
    padding: 0px;
    margin: 0px;
    background: #fff;
    color: #5684ff;
  }
  .login {
    width: 90%;
    height: 40px;
    background: #5684ff;
    color: #fff;
    letter-spacing: 10px;
    font-size: 16px;
  }
  .register {
    margin-top: 20px;
    width: 90%;
    height: 40px;
    border: 1px solid #5684ff;
    color: #5684ff;
    letter-spacing: 10px;
    font-size: 16px;
  }
}
.clause {
  text-align: left;
  padding-left: 20px;
  /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
  /deep/.el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #5684ff;
    border-color: #5684ff;
  }
  /deep/.el-checkbox__inner {
    width: 18px;
    height: 18px;
    border: 1px solid #111;
  }
  /deep/.el-checkbox__inner::after {
    left: 6px;
    top: 3px;
  }
  span {
    color: #5684ff;
  }
}
.phoneCodeSign {
  float: right;
  padding: 15px;
  text-decoration: underline;
  color: #5684ff;
  font-size: 18px;
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
<style>
/* messageBox弹框的样式 */
.el-message-box {
  width: 340px !important;
}
.el-button--primary {
  background-color: #5684ff !important;
  border-color: #5684ff !important;
}
</style>