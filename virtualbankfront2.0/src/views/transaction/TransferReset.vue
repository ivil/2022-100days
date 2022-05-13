<template>
  <div class="transfer">
    <acc-navigation2 :title="title"></acc-navigation2>
    <ul class="transferForm">
      <li>
        <span>收款户名</span>
        <input
          type="text"
          placeholder="请输入收款户名"
          v-model="transferForm.username"
        />
        <i class="el-icon-user" @click="recode"></i>
      </li>
      <p class="p">{{ name }}</p>
      <li>
        <span>收款人账号</span>
        <input
          type="text"
          placeholder="请输入收款账户"
          v-model="transferForm.inAccountId"
        />
      </li>
      <p class="p">{{ getMoney }}</p>
      <li>
        <span>收款银行</span>
        <input
          type="text"
          placeholder="请输入收款银行"
          v-model="transferForm.bankName"
        />
      </li>
      <p class="p">{{ getBack }}</p>
      <li>
        <span>付款账户</span>
        <span>
          <el-select v-model="transferForm.outAccountId" placeholder="请选择">
            <el-option
              v-for="(item, index) in accountList"
              :key="index.accountId"
              :label="item.bankName"
              :value="item.accountId"
              @click.native="chooseItem(item)"
            >
            </el-option>
          </el-select>
        </span>
      </li>
      <p class="p">{{ payMoney }}</p>
      <li>
        <span>可用余额</span>
        <p>{{ money }}元</p>
      </li>
      <li style="border: none">
        <span>转出金额</span>
      </li>
      <li>
        <p>￥</p>
        <input
          type="text"
          placeholder="免手续费"
          v-model="transferForm.money"
        />
      </li>
      <p class="p1">{{ outMoney }}</p>
      <li>
        <input
          type="text"
          placeholder="请输入验证码"
          v-model="transferForm.captcha"
        />
        <p><img @click="getImgCode" :src="captcha" alt="图形验证码" /></p>
      </li>
      <p class="p1">{{ code }}</p>
    </ul>
    <p class="save">
      <input type="checkbox" v-model="ischecked" />是否保存收款账户?
    </p>
    <div class="next" @click="next">下一步</div>
    <div class="tip">
      <p>温馨提示</p>
      <p>
        1.为了您的资金安全,请勿轻信任何以公检法、网购刷单,客服退换,贷款代办、信用提额、高收益理财等为由
        进行转账要求、谨防电信网络诈骗。<br />
        2.请妥善保管卡号、密码、短信验证码等个人重要信息。
      </p>
    </div>
  </div>
</template>

<script>
import AccNavigation2 from "../../components/AccNavigation2.vue";
import {
  getAccountList,
  transfer,
  selectUserFriends,
  insertUserFriends,
  captcha,
} from "../../api/api";
import Check from "../../utils/Check";
import { encrypt } from "../../utils/AES";
import { Toast } from 'vant';
let checkThisForm = new Check();
export default {
  name: "TransferReset",
  components: { AccNavigation2 },
  data() {
    return {
      title: "转账",
      ischecked: false,
      flag: false,
      captcha: captcha + Math.random(),
      money: "",
      accountList: [
        {
          accountId: "1",
          bankName: "中国雄鸡银行1",
          money: 1,
        },
        {
          accountId: "2",
          bankName: "中国雄鸡银行2",
          money: 2,
        },
        {
          accountId: "3",
          bankName: "中国雄鸡银行3",
          money: 3,
        },
      ],
      transferForm: {
        userId: JSON.parse(sessionStorage.getItem("user")).userId,
        username: "",
        inAccountId: "",
        bankName: "",
        outAccountId: "",
        captcha: "", //图形验证码
        type: "transfer",
        money: "",
      },
      // 验证提示信息
      name: "",
      getMoney: "",
      getBack: "",
      payMoney: "", //付款账户
      outMoney: "", //转出金额
      code: "", //验证码
    };
  },
  methods: {
    next() {
      // 表单验证
      let testname = checkThisForm.checkIsEmpty(this.transferForm.username); //用户名
      let testNum = checkThisForm.checkCardID(this.transferForm.inAccountId); //收款户正则
      let tesNum2 = checkThisForm.checkIsEmpty(this.transferForm.outAccountId); //付款账户
      let testCaptcha = checkThisForm.checkIsEmpty(this.transferForm.captcha); //验证码
      console.log(this.transferForm);
      if (
        testname &&
        testNum &&
        testCaptcha &&
        tesNum2 &&
        !(this.transferForm.inAccountId === "") &&
        !(this.transferForm.money === "")
      ) {
        this.flag = true;
        if (this.ischecked) {
          //勾选时，发送请求
          let data = {
            userId: JSON.parse(sessionStorage.getItem("user")).userId,
            accountId: this.transferForm.inAccountId,
            friendName: this.transferForm.username,
            bankName: this.transferForm.bankName,
          };
          insertUserFriends(data).then((value) => {
            console.log(value);
          });
        }
        // 支付密码弹框
        this.$prompt("请输入支付密码", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          inputPattern: /^\d{6}$/,
          inputErrorMessage: "请输入6位正确支付密码",
          inputType: "password",
        })
          // 支付确定按钮
          .then((value) => {
            console.log(value);
            // 发送axios请求，将数据传给后端
            let data = {
              userId: JSON.parse(sessionStorage.getItem("user")).userId,
              username: this.transferForm.username,
              inAccountId: this.transferForm.inAccountId,
              bankName: this.transferForm.bankName,
              outAccountId: this.transferForm.outAccountId,
              money: this.transferForm.money,
              captcha: this.transferForm.captcha,
              payPassword: encrypt(value.value),
              imageId: this.captcha.split("=")[1],
            };
            transfer(data).then((value) => {
              console.log(value);
              if (value.code == 200) {
                Toast.success(value.message);
                this.$router.replace("/record");
              } else {
                Toast.fail(value.message);
              }
            });
          })
          .catch(() => {
            console.log(111111);
          });
      } // 否则表单验证不通过
      // 用户名
      if (!testname) {
        this.name = "用户名不为空";
      } else {
        this.name = "";
      }
      // 收款人
      if (!testNum) {
        this.getMoney = "请输入正确收款人账号";
      } else {
        this.getMoney = "";
      }
      // 付款账户
      if (!tesNum2) {
        this.payMoney = "请选择付款账户";
      } else {
        this.payMoney = "";
      }
      // 验证码
      if (!testCaptcha) {
        this.code = "请输入验证码";
      } else {
        this.code = "";
      }
      // 收款银行
      if (this.transferForm.inAccountId === "") {
        this.getBack = "请填写收款银行";
      } else {
        this.getBack = "";
      }
      // 转出金额
      if (Number(this.transferForm.money) > this.money) {
        this.outMoney = "账户余额不足";
      } else if (this.transferForm.money === "") {
        this.outMoney = "请填写转账金额";
      } else {
        this.outMoney = "";
      }
    },
    recode() {
      this.$router.replace({ name: "TransferPeople" });
    },
    // 点击图形验证码，再次请求数据
    getImgCode() {
      this.captcha = captcha + Math.random();
    },
    chooseItem(item) {
      this.money = item.money;
    },
  },
  created() {
    // 余额显示
    getAccountList().then(
      (value) => {
        if (value.code === 200) {
          sessionStorage.setItem("cardList", JSON.stringify(value.data));
          this.accountList = value.data;
          this.accountList.forEach((el) => {
            el.bankName =
              el.bankName +" ("+ el.accountId.substring(el.accountId.length - 4)+")";
          });
        }
      },
      (reason) => {
        console.log(reason);
      }
    );
  },
  mounted() {
    // 获取好友信息到页面上
    selectUserFriends().then((value) => {
      if (value.code === 200) {
        try {
          let thisData = value.data[this.$route.query.index];
          this.transferForm.username = thisData.friendName;
          this.transferForm.inAccountId = thisData.accountId;
          this.transferForm.bankName = thisData.bankName;
        } catch (e) {}
      }
    });
  },
};
</script>

<style lang="less" scoped>
.transfer {
  width: 100%;
  height: 100%;
  position: absolute;
  background: #f2f2f2;
}

.transferForm {
  margin-bottom: 30px;
  li {
    width: 94%;
    height: 60px;
    // margin: 10px 3%;
    padding: 0 3%;
    margin-top: 10px;
    display: flex;
    align-items: center;
    letter-spacing: 3px;
    border-bottom: 1px solid #999;
    background: #fff;
    &:nth-of-type(5) {
      p {
        width: 200px;
        text-align: right;
        font-size: 18px;
      }
    }
    &:nth-of-type(7) {
      margin-top: 0px;
      p {
        font-size: 35px;
        font-weight: 700;
      }
      input {
        text-align: left;
      }
    }
    &:nth-of-type(8) {
      input {
        text-align: left;
      }
      p {
        width: 140px;
        height: 50px;
        line-height: 50px;
      }
    }
    span {
      display: inline-block;
      font-size: 18px;
      width: 117px;
      text-align: left;
    }
    input {
      width: 200px;
      height: 40px;
      font-size: 18px;
      text-align: right;
      left: 10px;
      border: none;
      outline: none;
      margin-left: 10px;
      // background: #f2f2f2;
      background: #fff;
    }
  }
}

/deep/.el-icon-user:before {
  font-size: 22px;
  color: rgb(183, 48, 224);
  font-weight: 700;
}
/deep/.el-select .el-input__inner {
  background: #fff;
}

.p {
  float: right;
  margin-right: 20px;
  color: red;
  height: 20px;
  font-size: 12px;
}
.p1 {
  float: left;
  margin-left: 20px;
  color: red;
  height: 20px;
  font-size: 12px;
}

.next {
  width: 350px;
  height: 50px;
  background: rgb(183, 48, 224);
  margin: 30px auto;
  border-radius: 5px;
  font-size: 22px;
  line-height: 50px;
  letter-spacing: 3px;
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
.save {
  font-size: 18px;
}
/deep/.el-input__inner {
  width: 210px;
  height: 50px;
  background: #f2f2f2;
}
</style>