<template>
  <div class="password">
    <div class="wrap" v-show="showed"></div>
    <div class="box" v-show="showed">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <span @click="hiddenShow">X</span>
        <p>请输入支付密码</p>

        <el-form-item prop="pass">
          <el-input
            type="password"
            placeholder=""
            v-model="ruleForm.payPassword"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <p>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >确定</el-button
          >
        </p>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { deal } from "../api/api";
import { encrypt } from "../utils/AES";
export default {
  name: "password",
  props: {
    formData: {
      default: {
        userId: "null",
        accuntId: "null", //银行卡号
        money: "null",
        captcha: "null",
      },
      type: Object,
    },
  },
  data() {
    var validatePass = (rule, value, callback) => {
      let payword = /^\d{6}$/;
      if (value === "") {
        callback(new Error("支付密码不能为空"));
      } else if (payword.test(value)) {
        callback();
      } else {
        callback(new Error("请输入六位支付密码"));
      }
    };
    return {
      showed: true,
      ruleForm: {
        payPassword: "123456",
      },
      rules: {
        // pass: [{ validator: validatePass, trigger: "blur" }],
      },
    };
  },
  methods: {
    // 点击X,取消支付
    hiddenShow() {
      this.showed = !this.showed;
      this.$emit("show", this.showed);
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.ruleForm.payPassword = encrypt(this.ruleForm.payPassword);
          let data = {
            ...this.formData,
            ...this.ruleForm,
          };
          data.payPassword = encrypt(data.payPassword);
          console.log(data);
          // deal(data).then(
          //   (value) => {
          //     if (value.code === 200) {
          //       console.log(value.message);
          //       this.$router.replace({ name: "TransferSuccess" });
          //     } else {
          //       console.warn(value.message);
          //     }
          //   },
          //   (reason) => {
          //     console.log(reason);
          //     this.$router.replace({ name: "Recharge" });
          //   }
          // );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100%;
  background: #999;
  position: fixed;
  top: 0;
  opacity: 0.5;
}
.box {
  width: 320px;
  height: 260px;
  border-radius: 5px;
  background: #fff;
  position: absolute;
  z-index: 100;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  span {
    display: block;
    margin-left: 270px;
    width: 30px;
    height: 20px;
    margin-top: 10px;
  }
  p {
    margin-top: 20px;
    font-size: 18px;
    &:nth-of-type(2) {
      color: #999;
      font-size: 14px;
      margin: 10px 0 0 -170px;
    }
    &:nth-of-type(2) {
      width: 260px;
      height: 50px;
      background: #5684ff;
      margin: 45px auto;
      line-height: 50px;
      border-radius: 5px;
      color: #fff;
      font-size: 20px;
      letter-spacing: 5px;
    }
  }
}

/deep/.el-input__inner {
  width: 270px;
  height: 40px;
  border: 1px solid #999;
  margin-top: 30px;
  outline: medium;
  text-align: center;
  font-size: 18px;
}
/deep/.el-form-item.is-error .el-input__inner {
  border-color: none;
}
/deep/.el-form-item__error {
  left: 25px;
  margin-top: 10px;
}
/deep/.el-button--primary {
  width: 260px;
  height: 50px;
  background: #5684ff;
  border: none;
}
/deep/.el-button--primary:focus,
.el-button--primary:hover {
  background: #5684ff;
  border: none;
}
/deep/.el-button {
  font-size: 20px;
  letter-spacing: 5px;
}
</style>

