<template>
  <div class="Recharge">
    <div class="nav">
      <div class="title">
        <p @click="goBack"><i class="el-icon-arrow-left"></i></p>
        <p>充 值</p>
        <p><i class="iconfont">&#xe618;</i></p>
      </div>
      <div class="way">
        <ul>
          <li style="letter-spacing: 3px">充值方式</li>
          <li>
            <p>{{ card.bankName }}</p>
            <p>单日限额:{{ card.dailyMoney }}</p>
            <p>余额:{{ card.money }}</p>
          </li>
          <!---- 抽屉选择框 ---->
          <li>
            <el-button
              @click="drawer = true"
              type="primary"
              style="margin-left: 0px"
            >
              <i class="el-icon-arrow-right"></i>
            </el-button>

            <el-drawer
              title="选择充值银行卡"
              :visible.sync="drawer"
              :direction="direction"
            >
              <p
                v-for="(item, index) in arr"
                :key="index"
                @click="choose(item)"
              >
                {{ item.bankName }}
                <span id="cardname">
                  ({{ item.accountId.substring(0, 4) }}****{{
                    item.accountId.substring(item.accountId.length - 4)
                  }})
                </span>
              </p>
            </el-drawer>
          </li>
        </ul>
      </div>
    </div>

    <div class="middle">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <ul>
          <!--------- 充值金额 ------->
          <li><p>充值金额</p></li>
          <li>
            <p>￥</p>
            <el-form-item prop="money">
              <el-input
                type="number"
                v-model="ruleForm.money"
                autocomplete="off"
                @focus="hiddenShow()"
              >
              </el-input>
            </el-form-item>
          </li>

          <!----------- 图形验证码 ---------->
          <li>
            <span class="saycode">验证码</span>
            <el-form-item prop="captcha">
              <el-input
                type="text"
                v-model="ruleForm.captcha"
                autocomplete="off"
                @focus="hiddenShow()"
                class="code"
              ></el-input>
              <span class="span"
                ><img :src="captcha" alt="" @click="getCaptcha"
              /></span>
            </el-form-item>
          </li>
        </ul>

        <ul>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            class="button"
            >确定</el-button
          >
        </ul>
      </el-form>
    </div>
  </div>
</template> 

<script>
import { Toast } from 'vant';
import { getAccountList, recharge, captcha } from "../../api/api";
import { encrypt } from "../../utils/AES";
import Keyboard from "../../utils/Keyboard";

export default {
  components: {},
  name: "Recharge",
  data() {
    // 充值金额校验
    var validatePass = (rule, value, callback) => {
      // 0-50000
      // let patterAmount = /^(?:[1-9]\d{0,3}|50000|[1-4]\d{4})$/;
      let patterAmount = /^50000$|^((\d|[1-9]\d{1,3}|[1-4]\d{4})(\.\d{0,2})?)$/;
      if (value === "") {
        callback(new Error("充值金额不能为空"));
      } else if (patterAmount.test(value)) {
        callback();
      } else if (value > 50000) {
        callback(new Error("充值金额大于单日交易限额,请重新输入"));
      } else if (value > this.amount) {
        callback(new Error("充值金额大于银行卡余额,请重新输入"));
      } else {
        callback(new Error("请输入正确金额"));
      }
    };

    // 图形验证码
    var validateCode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("验证码不能为空"));
      } else {
        callback();
      }
    };

    return {
      keyboard: "",
      captcha: captcha + Math.random(),
      ruleForm: {
        money: "", // 充值金额
        captcha: "", //图形验证码
        accountId: "",
        userId: 'JSON.parse(sessionStorage.getItem("user")).userId',
        imageId: "",
      },
      rules: {
        money: [{ validator: validatePass, trigger: "blur" }],
        captcha: [{ validator: validateCode, trigger: "blur" }],
      },

      // 下拉框配置
      drawer: false,
      direction: "btt",
      isFalse: false,
      flag: false,

      card: {
        accountId: "银行卡号",
        money: "银行卡余额",
        bankName: "银行卡名",
        dailyMoney: "银行卡限额",
      },
      // 选择框信息
      arr: [
        // {
        //   accountId: "777",
        //   money: "999",
        //   bankName: "xxl",
        //   dailyMoney: "50000",
        // },
      ],
    };
  },
  methods: {
    goBack() {
      this.$router.push("/");
    },
    choose(item) {
      this.card.bankName = item.bankName;
      this.card.dailyMoney = item.dailyMoney;
      this.card.money = item.money;
      this.card.accountId = item.accountId;
      this.ruleForm.accountId = item.accountId;
      this.drawer = false;
    },
    hiddenShow() {
      this.isFalse = true;
    },
    getCaptcha() {
      this.captcha = captcha + Math.random();
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let btn = document.querySelector(".button");
          let keyboard = new Keyboard(btn, () => {
            this.ruleForm.imageId = this.captcha.split("=")[1];
            // this.flag = true; //呼出支付密码框
            console.log(keyboard.$input.value);
            let data = {
              payPassword: encrypt(keyboard.$input.value),
              ...this.ruleForm,
            };
            console.log(data);
            recharge(data).then(
              (value) => {
                console.log(value);
                if (value.code === 200) {
                  Toast.success(value.message)
                  this.$router.replace("/record");
                } else {
                  Toast.fail(value.message)
                }
              },
              (reason) => {
                console.log(reason);
              }
            );
          });
        } else {
          console.log("请检查输入是否合法");
        }
      });
    },
  },
  mounted() {
    // 查询已绑定的银行卡列表
    getAccountList().then(
      (value) => {
        if (value.code === 200) {
          sessionStorage.setItem("cardList", JSON.stringify(value.data));
          let cardList = [];
          try {
            value.data.forEach((el) => {
              if (el.type === "1") {
                cardList.push({
                  accountId: el.accountId,
                  money: el.money,
                  bankName: el.bankName,
                  dailyMoney: el.dailyMoney,
                });
              }
            });
          } catch (e) {
            console.log(e);
          }
          this.arr = cardList;
          this.card = {
            money: cardList[0].money,
            bankName: cardList[0].bankName,
            dailyMoney: cardList[0].dailyMoney,
          };
          this.ruleForm.accountId = cardList[0].accountId;
        } else {
        }
      },
      (reason) => {
        console.log(reason);
      }
    );
  },
};
</script>

<style lang='less' scoped>
@letter-spacing: 3px;
@background: rgb(232, 194, 243);
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav {
  width: 100%;
  height: 200px;
  // background: #EDEDED;
  background: @background;
  position: relative;
}
.title {
  width: 100%;
  height: 50px;
  .flex();
  p {
    width: 60px;
    height: 50px;
    line-height: 50px;
    font-size: 22px;
    &:nth-child(2) {
      font-weight: 800;
      letter-spacing: @letter-spacing;
      font-size: 20px;
    }
  }
}

.way {
  width: 94%;
  height: 80px;
  padding: 0 3%;
  margin-top: 30px;
  ul {
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    li {
      width: 100px;
      color: #000;
      font-size: 18px;
      &:nth-child(1) {
        margin-top: 3px;
      }
      &:nth-of-type(2) {
        width: 190px;
        text-align: left;
        line-height: 30px;
        p {
          font-size: 18px;
          color: #646464;
          &:nth-of-type(1) {
            font-weight: 800;
            letter-spacing: @letter-spacing;
            color: #000;
          }
        }
      }
      &:nth-of-type(3) {
        width: 50px;
        // color: #999;
        color: #000;
        line-height: 50px;
        font-size: 22px;
      }
    }
  }
}
/deep/.el-button--primary {
  border: none;
  color: #999;
  font-size: 22px;
  background: @background !important;
}
/deep/.el-button--primary:focus,
.el-button--primary:hover {
  background: @background;
  border: none;
  color: #999;
}

.code {
  width: 160px;
  height: 50px;
}
.span {
  float: right;
}
.saycode {
  width: 60px;
  height: 50px;
  float: left;
  font-size: 18px;
}

.middle {
  width: 94%;
  padding: 3%;
  height: 170px;
  background: #fff;
  position: absolute;
  top: 180px;
  border-radius: 13px;
  ul {
    width: 100%;
    &:nth-child(2) {
      height: 60px;
      margin-top: 30px;
    }
    li {
      width: 100%;
      height: 50px;
      margin-top: 10px;
      text-align: left;
      line-height: 50px;
      p {
        font-size: 18px;
        letter-spacing: @letter-spacing;
        color: rgb(183, 48, 224);
      }
      &:nth-child(2) {
        display: flex;
        p {
          font-size: 38px;
          font-weight: 800;
          color: #000;
        }
      }
    }
  }
}

/deep/.el-input__inner {
  border: none;
  outline: medium;
  font-size: 28px;
  color: #000;
  // border-left: 1px solid #999;
  border-bottom: 1px solid #999;
}

.next {
  width: 83px;
  height: 130px;
  position: absolute;
  bottom: 58px;
  right: 12px;
  z-index: 100;
  background: rgb(211, 124, 238);
  border-radius: 5px;
}
// .button {
//   height: 130px;
//   color: #fff;
//   font-size: 20px;
//   letter-spacing: 5px;
//   background: rgb(183, 48, 224) !important;
// }
.button {
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background: rgb(191, 66, 230) !important;
  color: #fff;
  letter-spacing: 3px;
}
@font-face {
  font-family: "iconfont"; /* Project id 3184220 */
  src: url("//at.alicdn.com/t/font_3184220_csy06wesq65.woff2?t=1645958680293")
      format("woff2"),
    url("//at.alicdn.com/t/font_3184220_csy06wesq65.woff?t=1645958680293")
      format("woff"),
    url("//at.alicdn.com/t/font_3184220_csy06wesq65.ttf?t=1645958680293")
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