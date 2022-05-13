<template>
  <div>
    <DealNav :title="title" />
    <div class="main">
      <div class="header">
        <li>
          <h3>{{ details.name }}</h3>
        </li>
        <li>
          <template v-if="details.type === '提现' || details.type === '充值'">
            <h3>{{ details.type }}:</h3>
            <h3>{{ details.money }}元</h3>
          </template>
          <template v-if="details.type === '支出'">
            <h3 style="color: red">{{ details.type }}:</h3>
            <h3 style="color: red">{{ details.money }}元</h3>
          </template>
          <template v-if="details.type === '收入'">
            <h3 style="color: rgb(35, 195, 189)">{{ details.type }}:</h3>
            <h3 style="color: rgb(35, 195, 189)">{{ details.money }}元</h3>
          </template>
        </li>
      </div>
      <ul>
        <li>
          <h3>交易流水号</h3>
          <h3>{{ details.transferId }}</h3>
        </li>
        <li v-show="notWithdrawShow">
          <h3>付款卡号</h3>
          <h3>{{ details.outAccountId }}</h3>
        </li>
        <li v-show="notRechargeShow">
          <h3>收款卡号</h3>
          <h3>{{ details.accountId }}</h3>
        </li>
        <li>
          <h3>交易时间</h3>
          <h3>{{ details.createTime }}</h3>
        </li>
        <li>
          <h3>币种</h3>
          <h3>人民币</h3>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getRecordDetail } from "../../api/api";
import DealNav from "../../components/DealNav.vue";
export default {
  components: { DealNav },
  name: "Details",
  data() {
    return {
      title: "交易详情",
      details: {
        transferId: "", //交易流水号
        name: "", //交易主体
        accountId: "", //对方账户
        outAccountId: "", //付款账户
        createTime: "",
        money: "",
        type: "", //交易类型
      },
      notRechargeShow: true,
      notWithdrawShow: true,
    };
  },
  created() {
    let detail;
    let templist = JSON.parse(sessionStorage.getItem("recordList"));
    for (let i = 0; i < templist.length; i++) {
      if (templist[i].id === this.$route.query.transferId) {
        detail = templist[i];
        break;
      }
    }
    console.log(detail);
    if (detail.type === "0002") {
      detail.money = "+" + Number(detail.money).toFixed(2);
      detail.type = "收入";
    } else if (detail.type === "0006") {
      detail.type = "提现";
      detail.username = "";
      this.notWithdrawShow = false;
    } else if (detail.type === "0005") {
      detail.type = "充值";
      detail.username = "";
      this.notRechargeShow = false;
    } else if (detail.type === "0013") {
      detail.money = "-" + Number(detail.money).toFixed(2);
      detail.type = "支出";
    }
    this.details = {
      transferId: detail.id, //交易流水号
      name: detail.username, //交易主体
      accountId: detail.inAccountId, //对方账户
      outAccountId: detail.outAccountId, //付款账户
      createTime: detail.createTime,
      money: detail.money,
      type: detail.type, //交易类型
    };

    // 卡号脱敏
    this.details.accountId =
      detail.inAccountId.substring(0, 4) +
      "****" +
      detail.inAccountId.substring(detail.inAccountId.length - 4);
    this.details.outAccountId =
      detail.outAccountId.substring(0, 4) +
      "****" +
      detail.outAccountId.substring(detail.outAccountId.length - 4);
  },
};
</script>

<style lang="less" scoped>
.header {
  width: 98vw;
  margin: 10px auto;
  height: 150px;
  li {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: larger;
    &:nth-child(2) {
      width: 100%;
      height: 50px;
      // background: lightblue;
      h3 {
        margin-right: 10px;
      }
    }
  }
}
.main {
  position: fixed;
  left: 0;
  right: 0;
  top: 52px;
  bottom: 0;
  // background-image: linear-gradient(to top, #dfe9f3 0%, white 100%);
  ul {
    width: 90vw;
    margin: 10px auto;
    li {
      height: 60px;
      width: 100%;
      background-color: transparent;
      margin: 10px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      h3 {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 500;
        &:nth-child(1) {
          width: 30%;
          justify-content: flex-start;
        }
        &:nth-child(2) {
          width: 70%;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>