<template>
  <div class="forgetPass">
    <acc-navigation :title="title" />
    <!-- 忘记密码步骤条 -->
    <div class="step">
      <el-steps
        :active="active"
        align-center
        finish-status="success"
        :process-status="progress"
      >
        <el-step title="验证手机号"></el-step>
        <el-step title="设置密码"></el-step>
        <el-step title="修改成功"></el-step>
      </el-steps>
      <!------------------ 1、验证手机号 ------------------>
      <div v-if="step1" class="step1">
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
              placeholder="请输入11位手机号"
              v-model="ruleForm.phone"
              maxlength="11"
            >
              <template slot="prepend">手机号</template>
            </el-input>
          </el-form-item>
          <!-- 验证码 -->
          <el-form-item prop="code">
            <el-input
              placeholder="请输入6位短信验证码"
              v-model="ruleForm.code"
              maxlength="6"
            >
              <template slot="prepend">验证码</template>
              <el-button slot="append" @click="sendCode">{{
                sendCode1
              }}</el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <!------------------ 2、设置密码 ------------------>
      <div v-if="step2" class="step2">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <!-- 密码 -->
          <el-form-item prop="pass" style="height: 42px">
            <el-input
              type="password"
              placeholder="密码8-16位, 字母数字字符组合"
              v-model="ruleForm.pass"
              maxlength="16"
            >
              <template slot="prepend"
                >密&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;码</template
              >
            </el-input>
            <!-- 密码强度 -->
            <progress
              :value="passStrong"
              max="100"
              v-if="showStrong"
            ></progress>
            <p v-if="showStrong">{{ strong }}</p>
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
        </el-form>
      </div>
      <!------------------ 3、修改成功 ------------------>
      <div v-if="step3" class="step3">
        <i class="el-icon-check success"></i>
        <p class="success1">修改成功</p>
        <p>{{ seconds }}后将自动跳转到登录页面</p>
      </div>

      <el-button style="margin-top: 12px" @click="next" v-show="nextShow"
        >下一步</el-button
      >
    </div>
  </div>
</template>

<script>
import { forgetPass, getPhoneCode } from "../../api/api";
import { encrypt } from "../../utils/AES";
import AccNavigation from "../../components/AccNavigation.vue";
import { Toast } from "vant";
export default {
  name: "ForgetPass",
  components: {
    AccNavigation,
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
    // 判断验证码是否与后端的一致
    let validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*验证码不为空"));
      } else {
        callback();
      }
    };
    // 密码正则验证
    let validatePass = (rule, value, callback) => {
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
    // 判断确认密码是否与密码一致
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
      title: "忘记密码",
      active: 0, //步骤条
      step1: true, //控制步骤的显示隐藏
      step2: false,
      step3: false,
      ruleForm: {
        //表单输入的值
        phone: "",
        code: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        // 表单失焦验证
        phone: [{ validator: validatePhone, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
      sendCode1: "发送验证码",
      time: 59,
      showStrong: false, //密码强度显示
      passStrong: 0,
      strong: "",
      seconds: "3s",
      progress: "progress", //设置步骤条当前状态
      nextShow: true, //下一步按钮是否显示
      hasSendCode: false,
    };
  },
  methods: {
    // 发送短信验证码（60秒倒计时）
    sendCode(e) {
      if (this.ruleForm.phone != "") {
        this.hasSendCode = true;
        if (e.target.innerHTML !== "发送验证码") {
          return;
        } else {
          let data = {
            mobilePhone: this.ruleForm.phone,
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
      } else {
        Toast.fail("请先输入手机号！");
      }
    },
    // 点击步骤条的下一步
    next() {
      this.$refs.ruleForm.validate((valid) => {
        // 当所有表单验证通过后，才可进行下一步
        if (valid && this.active === 0) {
          //手机号填写完成后，发送axios请求
          let data = {
            mobilePhone: this.ruleForm.phone,
            phoneCode: this.ruleForm.code,
          };
          forgetPass(data).then(
            (value) => {
              console.log(value);
              if (value.code === 200) {
                this.active++;
                this.step1 = false;
                this.step2 = true;
              } else if (value.code === 500) {
                // 显示错误
                Toast.fail(value.message);
              }
            },
            (reason) => {
              console.log(reason);
            }
          );
        } else if (valid && this.active === 1) {
          // 用axios向后端发数据，修改密码
          let data = {
            mobilePhone: this.ruleForm.phone,
            password: encrypt(this.ruleForm.pass),
          };
          forgetPass(data).then(
            (value) => {
              console.log(value);
              if (value.code === 200) {
                this.active++;
                this.step1 = false;
                this.step2 = false;
                this.step3 = true;
                let timer = setTimeout(() => {
                  this.progress = "success";
                }, 300);
                if (this.progress === "success") {
                  clearTimeout(timer);
                }

                // 密码修改成功，倒计时3s跳转到登录页面
                let flag = 1;
                if (flag == 1) {
                  let i = 2;
                  flag = 0;
                  let n = setInterval(() => {
                    let j = i + "s";
                    this.seconds = j;
                    i--;
                    if (i < -1) {
                      clearInterval(n);
                      flag = 1;
                      this.$router.replace("/passSign");
                    }
                  }, 1000);
                }
              } else if (value.code === 500) {
                // 显示错误
                Toast.fail(value.message);
              }
            },
            (reason) => {
              console.log(reason);
            }
          );
        }
        if (this.active === 1) {
          this.nextShow = false; //密码修改成功时，让下一步的按钮隐藏
        }
      });
    },
    // 返回上一步
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.step {
  /deep/.el-step__head.is-success > .el-step__line {
    border-color: #5684ff;
    background-color: #5684ff;
    color: #5684ff;
  }
  .el-steps {
    padding: 25px 0px;
    background: #f6f6f6;
    margin-top: 6px;
    margin-bottom: 20px;
    /deep/.el-step__title {
      font-size: 14px;
    }
    /deep/.el-step__title.is-success {
      color: #5684ff;
    }
    /deep/.el-step__head.is-success {
      color: #5684ff;
      border-color: #5684ff;
    }
  }
  // step表单中的共同样式
  .step() {
    .border() {
      border: none;
      font-size: 18px;
      color: #000;
    }
    /deep/.el-input-group__prepend {
      .border();
      background-color: #fff;
      padding: 0px 15px;
    }
    /deep/.el-input__inner {
      border: none;
      font-size: 16px;
      margin-top: 2px;
      padding: 0px 5px;
    }
    /deep/.el-form-item__content {
      line-height: 0px;
    }
  }
  .step1 {
    .step();
    /deep/.el-form-item__error {
      left: 24%;
    }
    /deep/.el-input-group__append {
      .border();
      border-left: 1px solid #aaa;
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
  }
  .step2 {
    .step();
    /deep/.el-form-item__error {
      left: 28%;
    }
  }
  .step3 {
    .success {
      color: #52c41a;
      font-size: 100px;
    }
    .success1 {
      color: #52c41a;
      font-size: 20px;
      text-decoration: none;
      padding: 10px 0px;
    }
    p {
      padding: 10px 0px 30px 0px;
    }
  }
  .el-button {
    width: 92%;
    height: 50px;
    background: #5684ff;
    color: #fff;
    font-size: 16px;
    border-radius: 8px;
  }
}
@font-face {
  font-family: "iconfont"; /* Project id 3184220 */
  src: url("//at.alicdn.com/t/font_3184220_dooraecjaei.woff2?t=1645089724149")
      format("woff2"),
    url("//at.alicdn.com/t/font_3184220_dooraecjaei.woff?t=1645089724149")
      format("woff"),
    url("//at.alicdn.com/t/font_3184220_dooraecjaei.ttf?t=1645089724149")
      format("truetype");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>