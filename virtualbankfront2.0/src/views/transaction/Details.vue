<template>
  <div class="detail">
    <acc-navigation :title="title" />
    <div class="main">
      <div class="header">
        <li>
          <h3>{{ details.name }}</h3>
        </li>
        <li>
          <h3 style="color: orange">{{ details.type }}:</h3>
          <h3>{{ details.money }}元</h3>
        </li>
        <li>
          <h3></h3>
        </li>
      </div>
      <ul>
        <li>
          <h3>交易流水号</h3>
          <h3>{{ details.transferId }}</h3>
        </li>
        <li>
          <h3>交易时间</h3>
          <h3>{{ details.createTime }}</h3>
        </li>
        <li>
          <h3>币种</h3>
          <h3>人民币</h3>
        </li>
        <li>
          <h3>摘要</h3>
          <h3><h5>网上支付 财付通 美团平台</h5></h3>
        </li>
        <li>
          <h3>对方账户</h3>
          <h3>{{ details.accountId }}</h3>
        </li>
        <li>
          <h3>交易机构</h3>
          <h3>总行本部</h3>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { getRecordDetail } from "../../api/api";
export default {
  components: { AccNavigation },
  name: "Details",
  data() {
    return {
      title: "交易详情",
      details: {
        transferId: "", //交易流水号
        name: "", //交易主体
        accountId: "", //对方账户
        createTime: "",
        money: "",
        type: "", //交易类型
      },
    };
  },
  created() {
    getRecordDetail(this.$route.query.detailId).then(
      (value) => {
        if (value.code === 200) {
          console.log(value.message);
          this.details = {
            transferId: value.data.id, //交易流水号
            name: value.data.username, //交易主体
            accountId: value.data.inAccountId, //对方账户
            createTime: value.data.createTime,
            money: value.data.money,
            // type: "", //交易类型
          };
          // 充值005，提现006，转账002，
          if (value.data.type === "0002") {
            this.details.type = "转账";
          } else if (value.data.type === "0006") {
            this.details.type = "提现";
          } else if (value.data.type === "0005") {
            this.details.type = "充值";
          }
        } else {
          // this.$router.go(-1);
          console.log(value.message);
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
.detail {
  font-family: 楷体;
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
}
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
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
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