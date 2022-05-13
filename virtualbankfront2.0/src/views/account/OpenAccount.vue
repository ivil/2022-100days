<template>
  <div id="bindCard">
    <acc-navigation2 :title="title" />
    <!-- <h3>请开立电子账户</h3> -->
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
          <!-- 姓名 -->
          <el-form-item prop="username">
            <el-input
              type="text"
              placeholder="请输入姓名"
              v-model="ruleForm.username"
            >
              <template slot="prepend">姓名</template>
            </el-input>
          </el-form-item>
          <!-- 身份证号 -->
          <el-form-item prop="personalId">
            <el-input
              type="number"
              placeholder="请输入身份证号"
              v-model="ruleForm.personalId"
            >
              <template slot="prepend">身份证号</template>
            </el-input>
          </el-form-item>
          <!-- 支付密码 -->
          <el-form-item prop="payPassword">
            <el-input
              type="password"
              placeholder="请设置支付密码"
              v-model="ruleForm.payPassword"
              maxlength="6"
            >
              <template slot="prepend">设置支付密码</template>
            </el-input>
          </el-form-item>
          <!-- 确认支付密码 -->
          <el-form-item prop="payPasswordAgain">
            <el-input
              type="password"
              placeholder="请确认支付密码"
              v-model="ruleForm.payPasswordAgain"
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
import { encrypt } from "../../utils/AES";
import AccNavigation2 from "../../components/AccNavigation2.vue";
import { openAccSubmit } from "../../api/api";
import * as animationData from "../../assets/jsonLogo/bindcard.json";
// vant组件
import { Toast } from "vant";

// import SafeKeyboard from '../../utils/safeKeyboard';
export default {
  name: "BindCard",
  components: {
    AccNavigation2,
  },
  data() {
    // 校验姓名
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("姓名不为空！！！"));
      } else {
        callback();
      }
    };
    // 校验身份证号
    let validatePersonalId = (rule, value, callback) => {
      let reg =
        /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("身份证格式不正确！！！"));
      }
    };
    //校验支付密码
    let validatePaypassword = (rule, value, callback) => {
      let reg = /^\d{6}$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("只能输入六位数字！！！"));
      }
    };
    // 二次校验支付密码是否一致
    let validatePayPasswordAgain = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码！！！"));
      } else if (value !== this.ruleForm.payPassword) {
        callback(new Error("两次输入密码不一致!"));
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

      title: "开户",
      ruleForm: {
        userId: "",
        username: "",
        personalId: "",
        payPassword: "",
        payPasswordAgain: "",
      },
      rules: {
        // 表单失焦验证
        username: [{ validator: validateUsername, trigger: "blur" }],
        personalId: [{ validator: validatePersonalId, trigger: "blur" }],
        payPassword: [{ validator: validatePaypassword, trigger: "blur" }],
        payPasswordAgain: [
          { validator: validatePayPasswordAgain, trigger: "blur" },
        ],
      },
      sendCode1: "发送验证码",
      time: 59, //发送验证码倒计时
    };
  },
  methods: {
    // json动图
    handleAnimation: function (anim) {
      this.anim = anim;
      console.log(anim); //这里可以看到 lottie 对象的全部属性
    },

    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.ruleForm));
          data.payPassword = encrypt(data.payPassword);
          console.log(data);
          openAccSubmit(data).then(
            (value) => {
              console.log(value);
              if (value.code === 200) {
                // 更新缓存
                sessionStorage.setItem("user", JSON.stringify(value.data));
                this.$confirm("开户成功！是否绑卡?", "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                })
                  .then(() => {
                    console.log(value.message);
                    this.$router.push("/bindCard");
                  })
                  .catch(() => {
                    // 点击取消时，跳到首页
                    this.$router.replace("/");
                  });
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
          return false;
        }
      });
    },
  },
  mounted() {
    try {
      this.ruleForm.userId = JSON.parse(sessionStorage.getItem("user")).id;
    } catch (e) {}
  },
};
</script>

<style lang="less" scoped>
#bindCard {
  width: 100%;
  height: 100%;
  position: fixed;
  background: #f5f5f5;
  // h3 {
  //   margin-top: 30px;
  //   font-size: 20px;
  //   font-weight: 500;
  // }
  .pic {
    img {
      width: 100%;
    }
  }
  .main {
    margin-top: 30px;
    .form1 {
      .border() {
        border: none;
        font-size: 16px;
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
        background: #fff;
        padding: 0px 15px;
      }
      /deep/.el-input__inner {
        .border();
        padding-top: 2px;
        text-align: right;
        background: #fff;
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
        margin-top: 30px;
        font-size: 16px;
        box-shadow: 0px 0px 10px #bbb;
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
</style>