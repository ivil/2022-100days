<template>
  <div class="backSuccess">
    <acc-navigation :title="title" />
    <div class="logo">
      <img src="../../assets/index/成功.png" alt="" />
      <p>{{message.getMessage}}</p>
    </div>
    <div class="message">
      <p>赎回详情</p>
      <p>
        产品名称: <span>{{ message.productName }}</span>
      </p>
      <p>
        <!-- 赎回金额: <span>{{ message.money | formatMoney1 }}</span> -->
        赎回金额: <span>{{ message.money }}</span>
      </p>
      <p>
        交易时间: <span>{{ message.time }}</span>
      </p>
    </div>
    <div class="next" @click="click">确认</div>
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
      title: "赎回结果",
      message: {
        // getMessage:"",
        // productName: "",
        // money: 10000,
        // time: new Date().toLocaleString(),
      },
    };
  },
  methods: {
    click() {
      this.$router.replace({ name: "Index" });
    },
  },

  mounted() {
    // 获取赎回信息到页面上
    let temp = JSON.parse(this.$route.query);
    console.log(temp);
    this.message = {};
    this.message= {
        getMessage:temp.getMessage,
        productName: temp.productName,
        money: temp.money,
        time: new Date().toLocaleString(),
      };
  },
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

.next {
  width: 320px;
  height: 50px;
  background: #5684ff;
  margin: 30px auto;
  border-radius: 5px;
  line-height: 50px;
  font-size: 20px;
  letter-spacing: 5px;
  color: #fff;
}
</style>