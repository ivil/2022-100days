<template>
  <div id="transfer">
    <DealNav :title="title" />
    <div class="transfer">
      <el-form
        :model="transferForm"
        :rules="rules"
        ref="transferForm"
        label-width="86px"
        hide-required-asterisk
        label-suffix
      >
        <el-form-item label="收款户名" prop="username">
          <el-input
            class="nameInput"
            v-model="transferForm.username"
            placeholder="请输入收款户名"
          ></el-input>
          <i class="iconfont" @click="addUser">&#xe63b;</i>
          <van-action-sheet
            v-model="show"
            :actions="userFriends"
            cancel-text="取消"
            close-on-click-action
            @cancel="onCancel"
            @select="choose"
          />
        </el-form-item>

        <el-form-item label="收款账户" prop="inAccountId">
          <el-input
            class="elInput"
            v-model="transferForm.inAccountId"
            placeholder="请输入收款账户"
            @blur="getBankname"
          ></el-input>
        </el-form-item>

        <el-form-item label="收款银行" prop="bankName">
          <el-input
            class="elInput"
            v-model="transferForm.bankName"
            readonly
          ></el-input>
        </el-form-item>

        <el-form-item label="付款账户">
          <el-select
            class="elSelect"
            v-model="transferForm.outAccountId"
            placeholder="请选择付款账户"
          >
            <el-option
              v-for="(item, index) in accounts"
              :key="index"
              :label="item.bankName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="转出金额" prop="money">
          <el-input
            class="elInput"
            v-model="transferForm.money"
            placeholder="请输入转出金额"
          ></el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="captcha" class="imgCode">
          <el-input
            class="elInput"
            v-model="transferForm.captcha"
            placeholder="请输入验证码"
          ></el-input>
          <img :src="captcha" alt="图形验证码" @click="getImgCode" />
        </el-form-item>

        <!-- <el-form-item label="验证码" prop="captcha" label-width="86px" >
          <div class="captcha">
            <el-input
              class="elinput"
              placeholder="输入验证码"
              v-model="transferForm.captcha"
            ></el-input>
            <img :src="captcha" alt="图形验证码" @click="getImgCode" />
          </div>
        </el-form-item> -->

        <div class="save">
          <!-- <el-checkbox v-model="checked">保存联系人</el-checkbox> -->
          <input type="checkbox" v-model="checked" /><span>保存联系人</span>
        </div>
      </el-form>

      <!-- <div class="next" @click="next">下一步</div> -->
      <van-button class="next" @click="next" plain hairline type="info"
        >下一步</van-button
      >
      <div class="tip">
        <p>温馨提示</p>
        <p>
          1.为了您的资金安全，请勿轻信任何以公检法、网购刷单、客服退换、贷款代办、信用提额、高收益理财等为由
          进行转账要求、谨防电信网络诈骗。<br />
          2.请妥善保管卡号、密码、短信验证码等个人重要信息。
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
</template>

<script>
import DealNav from "../../components/DealNav.vue";
import {
  captcha,
  transfer,
  selectUserFriends,
  getAccountList,
  insertUserFriends,
  getBankName,
} from "../../api/api";
import Keyboard from "../../utils/Keyboard";
import { encrypt } from "../../utils/AES";
import { Toast } from "vant";
export default {
  name: "Transfer",
  components: { DealNav },
  data() {
    let validateAccount = (rule, value, callback) => {
      let reg = /^([1-9]{1})(\d{15}|\d{18})$/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确银行卡"));
      }
    };
    let validateMoney = (rule, value, callback) => {
      let reg =
        /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
      if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("金额格式不正确"));
      }
    };
    return {
      rules: {
        username: [
          { required: true, message: "请输入收款户名", trigger: "blur" },
        ],
        inAccountId: [
          { required: true, validator: validateAccount, trigger: "blur" },
        ],
        bankName: [
          { required: true, message: "请输入收款银行名", trigger: "blur" },
        ],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        money: [{ required: true, validator: validateMoney, trigger: "blur" }],
      },
      fullscreenLoading: false,
      title: "转账汇款",
      captcha: captcha + Math.random(),
      show: false,
      // 密码框
      value: "",
      isShow: false, //密码输入框默认隐藏
      maskShow: false, //遮罩层默认隐藏
      showKeyboard: true,
      userFriends: [
        // {
        //   name: "user1",
        //   accountId: "123131",
        //   bankName: "xxl",
        // },
        // {
        //   name: "user2",
        //   accountId: "",
        //   bankName: "",
        // },
        // {
        //   name: "user3",
        //   accountId: "",
        //   bankName: "",
        // },
      ],
      checked: false,
      transferForm: {
        userId: "",
        username: "",
        inAccountId: "",
        bankName: "",
        outAccountId: "",
        money: "",
        captcha: "",
        payPassword: "",
        imageId: "",
      },
      accounts: [
        // {
        //   bankName: "name1",
        //   accountId: "卡号1",
        //   money: "",
        // },
        // {
        //   bankName: "name2",
        //   accountId: "卡号2",
        //   money: "",
        // },
      ],
    };
  },
  methods: {
    // 点击遮罩层时，隐藏密码输入框
    clickMask() {
      this.isShow = false;
      this.maskShow = false;
      this.value = "";
    },
    next() {
      this.$refs.transferForm.validate((valid) => {
        if (valid) {
          this.isShow = true;
          this.maskShow = true;
        }
      });
    },
    getImgCode() {
      this.captcha = captcha + Math.random();
    },
    addUser() {
      this.show = true;
    },
    choose(e) {
      this.transferForm.inAccountId = e.accountId;
      this.transferForm.username = e.trueName;
      this.transferForm.bankName = e.bankName;
      console.log(this.transferForm);
    },
    onCancel() {
      Toast.fail("已取消");
    },
    getBankname() {
      getBankName(this.transferForm.inAccountId).then(
        (value) => {
          console.log(value);
          if (value.code === 200) {
            this.transferForm.bankName = value.data;
          }
        },
        (reason) => {
          console.log(reason);
        }
      );
    },
    // 密码输入完成
    finish() {
      this.isShow = false;
      this.maskShow = false;
      // this.value = "";
      // 发送axios请求
      let data = JSON.parse(JSON.stringify(this.transferForm));
      data.imageId = this.captcha.split("=")[1];
      (data.payPassword = encrypt(this.value.substring(0, 6))), //密码加密
        console.log(data);
      transfer(data).then(
        (value) => {
          console.log(value);
          if (value.code === 200) {
            // 交易成功则添加常用联系人
            if (this.checked === true) {
              let userData = {
                userId: this.transferForm.userId,
                accountId: this.transferForm.inAccountId,
                friendName: this.transferForm.username,
                bankName: this.transferForm.bankName,
              };
              insertUserFriends(userData).then(
                (value) => {
                  if (value.code === 200) {
                    Toast.success(value.message);
                  } else {
                    Toast.fail(value.message);
                  }
                },
                (reason) => {
                  console.log(reason);
                }
              );
            }
            this.$router.push({
              path: "/transferSuccess",
              query: {
                msg: "转账成功！",
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
  },
  created() {
    this.fullscreenLoading = true;
    try {
      this.transferForm.userId = JSON.parse(sessionStorage.getItem("user")).id;
      // 付款账户显示
      getAccountList().then(
        (value) => {
          if (value.code === 200) {
            sessionStorage.setItem("cardList", JSON.stringify(value.data));
            this.accounts = value.data;
            console.log(this.accounts);
            this.transferForm.outAccountId = this.accounts[0].id;
            this.accounts.forEach((el) => {
              el.bankName =
                el.bankName +
                `(${el.id.substring(0, 4)}****${el.id.substring(
                  el.id.length - 4
                )})`;
            });
            this.fullscreenLoading = false;
          }
        },
        (reason) => {
          console.log(reason);
        }
      );
      selectUserFriends().then((value) => {
        if (value.code === 200) {
          this.userFriends = value.data;
          this.userFriends.forEach((el) => {
            el.trueName = el.friendName;
            el.name =
              el.friendName +
              ` (${el.accountId.substring(0, 4)}****${el.accountId.substring(
                el.accountId.length - 4
              )})`;
          });
        }
      });
    } catch (e) {}
  },
};
</script>

<style lang="less" scoped>
.transfer {
  margin-top: 20px;
  // position: fixed;
  // right: 1vw;
  // left: 1vw;
  // top: 50px;
  // bottom: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  i {
    display: block;
    font-size: 24px;
    color: #5684ff;
    margin-top: 8px;
    margin-right: -30px;
  }
}
.nameInput {
  width: 80%;
  float: left;
}
// .addUser {
//   width: 22px;
//   height: 22px;
//   margin: 18px 0px 0px 0px;
// }
.elInput {
  width: 93%;
  float: left;
}
.elSelect {
  float: left;
  width: 93%;
}
.imgCode {
  letter-spacing: 6px;
  .elInput {
    width: 140px;
  }
  img {
    float: right;
    margin-top: 2px;
  }
}
// .captcha {
//   // height: 55px;
//   // width: 100%;
//   // margin-right: auto;
//   // margin-left: auto;
//   // display: flex;
//   // justify-content: center;
//   // align-items: center;
//   // .el-input {
//   //   margin-left: 50px;
//   // }
//   img {
//     // height: 90%;
//     // width: 120px;
//     background-color: white;
//     float: right;
//     margin-top: 2px;
//   }
// }
.elinput {
  width: 40vw;
}
.save {
  margin-top: 15px;
  margin-left: 10px;
  font-size: 18px;
  height: 20px;
  line-height: 30px;
  text-align: left;
  input {
    font-size: 18px;
    margin: 0 5px;
    width: 15px;
    height: 15px;
  }
}
.el-select {
  width: 268px;
}
.next {
  width: 94vw;
  margin-right: auto;
  margin-left: auto;
  height: 50px;
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  letter-spacing: 20px;
  font-size: 19px;
  background: #5684ff;
  border-radius: 5px;
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

/deep/.van-button__text {
  color: #fff;
}
.tip {
  width: 340px;
  height: auto;
  margin: 35px auto 0px;
  margin-top: 35px;
  p {
    text-align: left;
    color: rgb(82, 78, 78);
    line-height: 22px;
    &:nth-child(1) {
      color: orange;
      margin-bottom: 10px;
    }
  }
}
/deep/.el-form-item {
  border-bottom: 1px solid #999;
  margin: 0px 15px 20px 15px;
}
/deep/.el-form-item__label {
  // width: 100px;
  height: 60px;
  font-size: 18px;
  line-height: 60px;
  color: #000;
}
/deep/.el-input__inner {
  // width: 200px;
  height: 60px;
  font-size: 18px;
  border-radius: 0px;
  border: none;
  padding: 0px 10px;
}
/deep/.el-form-item__error {
  z-index: 1;
  left: 4%;
  margin-top: 5px;
  font-size: 16px;
}
@font-face {
  font-family: "iconfont"; /* Project id 3184220 */
  src: url("//at.alicdn.com/t/font_3184220_m8qosoopsmp.woff2?t=1646829638191")
      format("woff2"),
    url("//at.alicdn.com/t/font_3184220_m8qosoopsmp.woff?t=1646829638191")
      format("woff"),
    url("//at.alicdn.com/t/font_3184220_m8qosoopsmp.ttf?t=1646829638191")
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