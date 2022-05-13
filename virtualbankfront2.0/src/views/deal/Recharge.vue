<template>
  <div>
    <DealNav :title="title" />
    <div class="recharge">
      <div class="head">
        <span>
          <p>充值方式</p>
        </span>
        <span>
          <p>{{ bankName }}</p>
          <p>单日交易限额￥{{ dailyMoney }}</p>
        </span>
        <span>
          <i class="el-icon-arrow-right" @click="showAccounts"></i>
        </span>
      </div>
      <div class="body">
        <p>充值金额</p>
        <div class="input1">
          <h1>￥</h1>
          <input
            type="number"
            v-model="rechargeForm.money"
            @blur="checkInput"
            @keyup="money"
          />
        </div>
        <div class="captcha">
          <input
            type="text"
            v-model="rechargeForm.captcha"
            placeholder="请输入验证码"
          />
          <img :src="captcha" alt="图形验证码" @click="getGraphCode" />
        </div>
      </div>
      <van-button class="next" @click="next" plain hairline type="info"
        >下一步</van-button
      >
    </div>
    <van-action-sheet
      v-model="show"
      :actions="accounts"
      cancel-text="取消"
      close-on-click-action
      @cancel="onCancel"
      @select="choose"
    />

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
import DealNav from "../../components/DealNav.vue";
import { captcha, getAccountList, recharge } from "../../api/api";
import { encrypt } from "../../utils/AES";
import { Toast } from "vant";
export default {
  name: "Recharge",
  components: { DealNav },
  data() {
    return {
      title: "充值",
      captcha: captcha + Math.random(),
      show: false,
      bankName: "中国银行",
      dailyMoney: "50000.00",
      // 密码框
      value: "",
      isShow: false, //密码输入框默认隐藏
      maskShow: false, //遮罩层默认隐藏
      showKeyboard: true,
      accounts: [
        // {
        //   name: "",
        //   accountId: "",
        //   money: "",
        //   color: "",
        //   dailyMoney: "",
        // },
        // {
        //   name: "",
        //   accountId: "",
        //   money: "",
        //   color: "",
        //   dailyMoney: "",
        // },
      ],
      rechargeForm: {
        userId: "",
        accountId: "", //银行卡号
        money: "",
        payPassword: "",
        captcha: "",
        imageId: "",
      },
    };
  },
  methods: {
    // 点击遮罩层时，隐藏密码输入框
    clickMask() {
      this.isShow = false;
      this.maskShow = false;
      this.value = "";
    },
    money() {
      // 金额小数点后只能输入两位
      this.rechargeForm.money = this.rechargeForm.money.replace(
        /^(\-)*(\d+)\.(\d\d).*$/,
        "$1$2.$3"
      );
    },
    checkInput() {
      let reg =
        /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (!reg.test(this.rechargeForm.money)) {
        Toast.fail("输入金额格式有误！");
        return;
      }
      if (Number(this.rechargeForm.money) > Number(this.dailyMoney)) {
        Toast.fail("超过单日交易限额！");
        return;
      }
    },
    next() {
      if (this.rechargeForm.money === "") {
        Toast.fail("请输入金额！");
        return;
      } else if (this.rechargeForm.captcha === "") {
        Toast.fail("请输入验证码！");
        return;
      } else {
        this.isShow = true;
        this.maskShow = true;
        this.value = "";
      }
    },
    // 密码输入完成
    finish() {
      this.isShow = false;
      this.maskShow = false;
      // 发送axios请求
      let data = JSON.parse(JSON.stringify(this.rechargeForm));
      data.imageId = this.captcha.split("=")[1];
      data.payPassword = encrypt((this.value).substring(0, 6)), //密码加密
      console.log(data);
      recharge(data).then(
        (value) => {
          console.log(value);
          if (value.code === 200) {
            // 更新缓存（金额）
            let tempdata = JSON.parse(sessionStorage.getItem("user"));
            tempdata.money = value.data;
            sessionStorage.setItem("user", JSON.stringify(tempdata));
            this.$router.push({
              path: "/transferSuccess",
              query: {
                msg: "充值成功！",
              },
            });
          } else {
            this.value = "";
            Toast.fail(value.message);
          }
        },
        (reason) => {
          console.log(reason);
        }
      );
    },
    getGraphCode() {
      this.captcha = captcha + Math.random();
    },
    showAccounts() {
      this.show = true;
    },
    onCancel() {
      this.show = false;
    },
    choose(e) {
      console.log(e);
      this.rechargeForm.accountId = e.accountId;
      this.bankName = e.name;
      this.dailyMoney = e.dailyMoney;
    },
  },
  created() {
    try {
      this.rechargeForm.userId = JSON.parse(sessionStorage.getItem("user")).id;
    } catch (e) {}
    getAccountList().then(
      (value) => {
        console.log(value);
        if (value.code === 200) {
          this.accounts = [];
          this.rechargeForm.accountId = value.data[0].id;
          value.data.forEach((el) => {
            let obj = {
              name:
                el.bankName +
                ` (${el.id.substring(0, 4)}****${el.id.substring(
                  el.id.length - 4
                )})`,
              accountId: el.id,
              money: el.money,
              color: "#7de0e6",
              dailyMoney: el.dailyMoney,
            };
            this.accounts.push(obj);
            this.bankName = obj.name;
            this.dailyMoney = el.dailyMoney;
          });
        }
      },
      (reason) => {
        console.log(reason);
      }
    );
  },
};
</script>

<style lang="less" scoped>
.recharge {
  margin-top: 20px;
  position: fixed;
  right: 1vw;
  left: 1vw;
  top: 50px;
  bottom: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}
.head {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #5684ff;
  border-radius: 10px;
  color: #fff;
  height: 120px;
  font-weight: 500;
  span {
    &:nth-child(1) {
      p {
        margin: 10px;
        font-size: 20px;
      }
    }
    &:nth-child(2) {
      p {
        margin: 10px;
      }
    }
  }
}
.body {
  height: 200px;
  margin: 10px auto;
  padding: 0px 15px;
  p {
    text-align: left;
    font-size: 18px;
  }
}
.input1 {
  display: flex;
  align-items: flex-end;
  height: 80px;
  font-size: 22px;
  margin-top: 10px;
  border-bottom: 1px solid #999;
  input {
    height: 60%;
    font-size: 25px;
    font-weight: bolder;
    width: 300px;
    background-color: transparent;
    border: none;
    margin-left: 10px;
  }
}
.captcha {
  margin: 20px auto;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  input {
    text-align: center;
    height: 50%;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #999;
    font-size: 20px;
    width: 200px;
    padding-left: 20px;
  }
  img {
    width: 120px;
    height: 60px;
  }
}
.next {
  width: 94vw;
  margin-right: auto;
  margin-left: auto;
  height: 50px;
  margin-top: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 10px;
  font-size: 18px;
  background: #5684ff;
  border-radius: 5px;
}
/deep/.van-button__text {
  color: #fff;
}

/deep/.van-action-sheet__name {
  color: #000;
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
