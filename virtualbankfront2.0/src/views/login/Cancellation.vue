<template>
  <div id="cancellation">
    <acc-navigation :title="title" />
    <div class="main">
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
          <!-- 短信验证码 -->
          <el-form-item prop="phoneCode">
            <el-input
              placeholder="请输入6位验证码"
              v-model="ruleForm.phoneCode"
              maxlength="6"
            >
              <template slot="prepend">验证码</template>
              <p slot="append" @click="sendCode">{{ sendCode1 }}</p>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm">注销</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 温馨提示 -->
    <div class="reminder">
      <p class="rTitle">温馨提示：</p>
      <div class="text">
        <p>注销前，请检查您的电子账户是否还有余额。</p>
        <p>检查您的理财产品持仓列表是否为空。</p>
        <p>注销后，您的积分将被清空。</p>
      </div>
    </div>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { cancellation, getPhoneCode } from "../../api/api";
import { Toast } from "vant";
export default {
  name: "Cancellation",
  components: {
    AccNavigation,
  },
  data() {
    // 短信验证码
    let validatePhoneCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*短信验证码不为空"));
      } else {
        callback();
      }
    };
    return {
      title: "注销账号",
      registerPhone: "", //注册手机号，不可修改
      ruleForm: {
        phoneCode: "",
      },
      rules: {
        // 表单失焦验证
        phoneCode: [{ validator: validatePhoneCode, trigger: "blur" }],
      },
      sendCode1: "发送验证码",
      time: 59,
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
    // 点击注销时，提交数据给后端
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        console.log(valid);
        if (valid) {
          // 弹框提示：是否要注销？
          this.$confirm("确定注销账号吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          })
            .then(() => {
              // 发送axios请求
              let data = {
                userId: JSON.parse(sessionStorage.getItem("user")).id,
                mobilePhone: JSON.parse(sessionStorage.getItem("user"))
                  .mobilePhone,
                phoneCode: this.ruleForm.phoneCode,
              };
              cancellation(data).then(
                (value) => {
                  console.log(value);
                  if (value.code === 200) {
                    //清除缓存
                    sessionStorage.clear();
                    localStorage.clear();
                    //点击确定时，提示账号注销成功
                    Toast.success("账号注销成功！");
                    // 注销成功之后，跳转到首页
                    setTimeout(() => {
                      this.$router.push("/");
                    }, 1500);
                  } else if (value.code === 500) {
                    // 注销失败
                    Toast.fail(value.message);
                  }
                },
                (reason) => {
                  console.log(reason);
                }
              );
            })
            .catch(() => {});
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
#cancellation {
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
        text-align: right;
      }
      /deep/.el-form-item__content {
        line-height: 0px;
      }
      /deep/.el-form-item__error {
        left: 25%;
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
      p {
        color: #5684ff;
      }
    }
  }
  .reminder {
    margin-top: 30px;
    text-align: left;
    .rTitle {
      padding: 15px 0px 5px 15px;
      color: #5684ff;
    }
    .text {
      padding: 0px 15px;
      font-size: 15px;
      color: #999;
      p {
        padding: 5px 0px;
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