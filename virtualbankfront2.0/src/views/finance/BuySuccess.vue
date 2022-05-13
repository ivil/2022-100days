<template>
  <div class="backSuccess">
    <acc-navigation :title="title" />
    <div class="logo">
      <img src="../../assets/index/赎回成功.png" alt="" />
      <p>申购成功</p>
    </div>
    <div class="message">
      <p>申购详情</p>
      <p>
        产品名称: <span>{{ productName }}</span>
      </p>
      <p>
        持有金额: <span>{{ money | formatMoney1 }}</span>
      </p>
      <p>
        交易时间: <span>{{ time }}</span>
      </p>
    </div>
    <div class="btn">
      <div class="assets" @click="gotoPosition">我的资产</div>
      <div class="buyAgain" @click="gotoFinance">购买其他产品</div>
    </div>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
export default {
  name: "backSuccess",
    components: {
    AccNavigation,
  },
  data() {
    return {
      title:'申购结果',
      productName: this.$router.query.financeName,
      money: 10000,
      time: new Date().toLocaleString(), 
    };
  },
  methods: {
    gotoPosition() {
      this.$router.replace({ name: "Position" });
    },
    gotoFinance() {
      this.$router.replace({ name: "Finance" });
    },
  },
  mounted(){
    console.log(this.productName);
  }
};
</script>

<style lang='less' scoped>
.logo {
  width: 100%;
  height: 180px;
  margin-top: 20px;
  img {
    width: 80px;
    height: 80px;
  }
  p {
    font-size: 22px;
    margin-top: 20px;
  }
}

.message {
  width: 90%;
  margin: auto;
  left: 0;
  right: 0;
  height: 200px;
  p {
    font-size: 18px;
    text-align: left;
    margin: 20px 0;
    &:nth-child(1) {
      border-bottom: 1px solid #999;
    }
    span {
      margin-left: 20px;
    }
  }
}
.btn {
  display: flex;
  justify-content: space-around;
  padding: 50px 25px;
  .btnStyle() {
    width: 130px;
    height: 50px;
    line-height: 50px;
    border-radius: 5px;
    font-size: 18px;
  }
  .assets {
    .btnStyle();
    background: #fff;
    border: 1px solid #5684ff;
    color: #5684ff;
  }
  .buyAgain {
    .btnStyle();
    background: #5684ff;
    color: #fff;
  }
}
</style>