<template>
  <div v-loading.fullscreen.lock="fullscreenLoading">
    <DealNav :title="title" />
    <div class="body">
      <div class="card" v-for="(item, index) in cards" :key="index">
        <div class="main">
          <ul>
            <li>
              <p>
                <span>{{ item.cardName }}</span>
              </p>
              <p @click="lookCard(item)" style="font-size: 14px">
                <i :class="lock"></i>查看全卡号
              </p>
            </li>
            <li>
              <span>{{ item.cardID }}</span>
            </li>
            <li>
              可用余额: <i>{{ item.balance }}</i> 元
            </li>
          </ul>
        </div>
        <div class="menu">
          <ul>
            <li @click="unbindCard(item, index)">去解绑</li>
          </ul>
        </div>
      </div>
    </div>
    <button class="btn" @click="$router.push('/bindcard')">+添加新卡片</button>
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
import { getAccountList, relieveCard } from "../../api/api";
import { encrypt } from "../../utils/AES";
import DealNav from "../../components/DealNav.vue";
import { Toast } from "vant";
export default {
  name: "Card",
  components: { DealNav },
  data() {
    return {
      fullscreenLoading: false,
      // 密码框
      value: "",
      isShow: false, //密码输入框默认隐藏
      maskShow: false, //遮罩层默认隐藏
      tempItem: "",
      showKeyboard: true,
      title: "卡包",
      which: 0,
      accountId: 7,
      lock: "el-icon-lock",
      unlock: "el-icon-unlock",
      cards: [
        // {
        //   cardID: "12221",
        //   cardName: "xxl",
        //   balance: "100000",
        // },
        // {
        //   cardID: "1",
        //   cardName: "xxl",
        //   balance: "3",
        // },
      ],
      tempIndex: "",
    };
  },
  methods: {
    // 点击遮罩层时，隐藏密码输入框
    clickMask() {
      this.isShow = false;
      this.maskShow = false;
      this.value = "";
    },
    toRecord() {
      this.$router.push("/record");
    },
    // 查看卡号
    lookCard(item) {
      let icon = this.lock;
      this.lock = this.unlock;
      this.unlock = icon;
      let temp = item.cardID;
      item.cardID = item.trueID;
      item.trueID = temp;
    },
    // 解绑卡
    unbindCard(item, index) {
      // 弹框提示：解绑卡成功
      this.$confirm("确定解绑吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          // 支付密码弹框
          this.isShow = true;
          this.maskShow = true;
          this.tempItem = item;
          this.tempIndex = index;
        })
        .catch(() => {});
    },
    // 密码输入完成
    finish() {
      this.isShow = false;
      this.maskShow = false;
      let item = this.tempItem;
      this.fullscreenLoading = true;
      // 发送axios请求
      let data = {
        userId: JSON.parse(sessionStorage.getItem("user")).id,
        accountId: item.cardID.length > 14 ? item.cardID : item.trueID,
        payPassword: encrypt((this.value).substring(0, 6)), //密码加密
      };
      relieveCard(data).then((value) => {
        console.log(value);
        if (value.code === 200) {
          //提示解绑卡成功
          this.cards.splice(this.tempIndex, 1);
          this.fullscreenLoading = false;
          Toast.success(value.message);
        } else if (value.code === 500) {
          this.value = "";
          Toast.fail(value.message);
        }
      });
    },
  },
  created() {
    getAccountList().then(
      (value) => {
        if (value.code === 200) {
          console.log(value.data);
          // 将所有卡的信息存入vuex中
          this.$store.commit("getcardList", value.data);
          this.cards = [];
          console.log(value.data);
          let cardList = value.data;
          sessionStorage.setItem("cardList", JSON.stringify(cardList));
          // 从vuex中获取卡的信息
          this.$store.state.cardList.forEach((el) => {
            let tempID =
              el.id.substring(0, 4) +
              " **** " +
              el.id.substring(el.id.length - 4);
            let temp = {
              cardID: tempID,
              trueID: el.id,
              cardName: el.bankName,
              balance: el.money,
            };
            this.cards.push(temp);
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
.body {
  position: fixed;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 70px;
  padding-top: 10px;
  overflow-y: auto;
}
.btn {
  width: 360px;
  height: 60px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  border: none;
  font-size: 20px;
  background: #ebebeb;
  color: #5684ff;
  font-weight: 700;
  border-radius: 5px;
}
.card {
  width: 94vw;
  height: 190px;
  margin: 20px auto;
  background-image: url("../../assets/card/bgCard.jpg");
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  color: #fff;
}
.main {
  width: 100%;
  height: 140px;
  ul {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    li {
      height: 30px;
      padding: 0px 15px;
      margin-top: 10px;
      &:nth-child(1) {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      &:nth-child(2) {
        text-align: center;
        font-size: 25px;
        font-weight: bolder;
      }
      &:nth-of-type(3) {
        text-align: right;
        margin-left: -19px;
      }
    }
  }
}
.menu {
  height: 40px;
  width: 100%;
  bottom: 0;
  position: absolute;
  padding-bottom: 12px;
  ul {
    height: 100%;
    padding: 0px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    // color: red;

    li {
      width: 70px;
      height: 30px;
      background: rgb(243, 67, 67);
      line-height: 30px;
      border-radius: 20px;
    }
  }
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
  height: 120px;
  left: 0;
  right: 0;
  margin: auto;
  position: absolute;
  line-height: 50px;
  p {
    font-size: 18px;
    color: #000;
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