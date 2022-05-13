<template>
  <div id="buyProduct">
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
          <!-- 购买金额 -->
          <el-form-item prop="money">
            <el-input
              type="number"
              placeholder="请输入购买金额"
              v-model="ruleForm.money"
            >
              <template slot="prepend">购买金额</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm">确定支付</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 温馨提示 -->
      <div class="reminder">
        <p class="rTitle">温馨提示：</p>
        <div class="text">
          <p>
            根据银监会、证监会的相关要求，在购买我行代销基金产品前，需要先帮助您了解您的风险偏好及风险承受能力。
          </p>
          <p>当前产品风险等级为低，与您当前的风险承受能力保守型匹配。</p>
          <p>
            产品有风险，投资需谨慎。请您充分了解、清楚知晓本产品的风险，愿意承担有关风险，自愿投资。
          </p>
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
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { DecryptFront, encrypt } from "../../utils/AES";
import { buyFinance } from "../../api/api";
import { Toast } from "vant";
export default {
  name: "BuyProduct",
  components: {
    AccNavigation,
  },
  data() {
    // 购买金额
    let validateMoney = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("*购买金额不为空"));
      } else if (value < Number(this.startingprice)) {
        callback(new Error("购买金额需大于起购金额"));
      } else {
        callback();
      }
    };
    return {
      cardList: [],
      title: "产品购买",
      ruleForm: {
        //表单输入的值
        money: "",
      },
      formData: {},
      rules: {
        // 表单失焦验证
        money: [{ validator: validateMoney, trigger: "blur" }],
      },
      startingprice: DecryptFront(this.$route.query.price), //起购金额
      isShow: false, //密码输入框默认隐藏
      maskShow: false, //遮罩层默认隐藏
      value: "", //输入的密码
      showKeyboard: true,
    };
  },
  methods: {
    // 返回上一步
    back() {
      this.$router.go(-1);
    },
    // 点击遮罩层时，隐藏密码输入框
    clickMask() {
      this.isShow = false;
      this.maskShow = false;
      this.value = "";
    },
    // 确认支付，弹出密码框
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.isShow = true;
          this.maskShow = true;
        } else {
          //表单验证不通过
          return false;
        }
      });
    },
    // 密码输入完成
    finish() {
      this.isShow = false;
      this.maskShow = false;
      let data = {
        accountId: JSON.parse(sessionStorage.getItem("user")).id,
        payPassword: encrypt((this.value).substring(0, 6)), //密码加密
        userId: JSON.parse(sessionStorage.getItem("user")).id,
        financeId: DecryptFront(this.$route.query.financeId), //解密
        price: this.startingprice,
        money: this.ruleForm.money,
        rate: DecryptFront(this.$route.query.rate),
      };
      buyFinance(data).then((value) => {
        console.log(value);
        if (value.code === 200) {
          // 更新缓存（金额）
          let tempdata = JSON.parse(sessionStorage.getItem("user"));
          tempdata.money = value.data;
          sessionStorage.setItem("user", JSON.stringify(tempdata));
          // 购买成功提示
          Toast.success(value.message);
          this.$router.push("/finance");
        } else {
          Toast.fail(value.message);
          this.value = "";
        }
      });
    },
  },
  created() {
    // 获取申购信息
    buyFinance().then((value) => {
      if (value.code === 200) {
        this.ruleForm.card = value.data.accountId;
      }
    });
  },
};
</script>
 
<style lang="less" scoped>
#buyProduct {
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
      /deep/.el-input__inner {
        .border();
        padding-top: 2px;
      }
      /deep/.el-form-item__content {
        line-height: 0px;
      }
      /deep/.el-form-item__error {
        left: 25%;
        top: 68%;
      }
      /deep/.el-input-group__prepend {
        .border();
        background-color: #fff;
        padding: 0px 0px 0px 15px;
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
        width: 90%;
        height: 45px;
        font-size: 16px;
        position: fixed;
        bottom: 10px;
        left: 5%;
      }
      p.sendCode {
        width: 120px;
        height: 40px;
        line-height: 40px;
        color: #5684ff;
        text-align: right;
      }
      .center1() {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .balance {
        .center1();
        background: #fff;
        padding: 0px 15px;
        height: 60px;
        border-bottom: 1px solid #ececec;
        color: #777;
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
}

// // 密码框
// .mask {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.5);
// }
// /deep/.van-password-input {
//   bottom: 80px;
//   margin: 0px 10px;
// }
// /deep/.van-number-keyboard__close {
//   color: #5684ff;
//   font-size: 16px;
// }

// @font-face {
//   font-family: "iconfont"; /* Project id 3184220 */
//   src: url("//at.alicdn.com/t/font_3184220_54zjcig078o.woff2?t=1645155582274")
//       format("woff2"),
//     url("//at.alicdn.com/t/font_3184220_54zjcig078o.woff?t=1645155582274")
//       format("woff"),
//     url("//at.alicdn.com/t/font_3184220_54zjcig078o.ttf?t=1645155582274")
//       format("truetype");
// }
// .iconfont {
//   font-family: "iconfont" !important;
//   font-size: 20px;
//   font-style: normal;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
// }

// // 密码框
// .mask {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.5);
// }
// .password{
//   bottom: 340px;
//   width: 300px;
//   background: #fff;
//   border-radius: 5px;
//   height: 120px;
//   left: 0;
//   right: 0;
//   margin: auto;
//   position: absolute;
//   line-height: 40px;
//   p{
//     font-size: 18px;
//     color: #546ffe;
//   }
//   input{
//     width: 240px;
//     height: 50px;
//     font-size: 24px;
//     text-align: center;
//     letter-spacing: 8px;
//     border: 1px solid #999;
//   }
// }

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