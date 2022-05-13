<template>
  <div id="goodDetail">
    <acc-navigation :title="title" />
    <div class="main">
      <img src="@/assets/integral/good3.jpg" alt="" />
      <p class="price">{{ price }}分</p>
      <p class="title1">{{ name }}</p>
      <p class="msg">{{ description }}</p>
    </div>
    <p class="type">库存剩余：{{ stock }}份</p>
    <p class="type">兑换方式：纯积分</p>
    <p class="type">配送范围：全国配送</p>
    <!-- 底部导航栏 -->
    <ul class="tabBar">
      <!-- <li @click="addCart">加入购物车</li> -->
      <li @click="exchangeGood">立即兑换</li>
    </ul>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { exchange } from "../../api/api";
export default {
  name: "GoodDetail",
  components: {
    AccNavigation,
  },
  data() {
    return {
      title: "礼品详情",
      // imgPath: JSON.parse(this.$route.query.good).path,
      goodId: JSON.parse(this.$route.query.good).goodId,
      price: JSON.parse(this.$route.query.good).price,
      name: JSON.parse(this.$route.query.good).name,
      stock: JSON.parse(this.$route.query.good).stock, //库存
      description: JSON.parse(this.$route.query.good).description,
    };
  },
  methods: {
    // 返回上一步
    back() {
      this.$router.go(-1);
    },
    // 加入购物车
    // addCart() {},
    // 立即兑换
    exchangeGood() {
      let data = {
        productionId: this.goodId,
        userId: JSON.parse(sessionStorage.getItem("user")).id,
        amount: "1",
        price: this.price,
      };
      console.log(data);
      exchange(data).then((value) => {
        console.log(value);
        if (value.code === 200) {
          this.$toast.success("兑换成功");
          let userdata = JSON.parse(sessionStorage.getItem("user"))
          userdata.score = value.data.score
          sessionStorage.setItem('user',JSON.stringify(userdata))
          this.$router.go(-1);
        } else {
          this.$toast.fail(value.message);
          this.$router.go(-1);
        }
        // if (value.code === 200) {
        //   this.$alert("兑换成功", "提示", {
        //     confirmButtonText: "确定",
        //     type: "primary",
        //   })
        //     .then(() => {
        //       // 将用户信息存进缓存（更新缓存）
        //       sessionStorage.setItem("user", JSON.stringify(value.data));
        //     })
        //     .catch(() => {});
        // } else if (value.code === 500) {
        //   // 积分不足，兑换失败
        //   this.$alert(`${value.message}，兑换失败`, "提示", {
        //     confirmButtonText: "确定",
        //     type: "primary",
        //   })
        //     .then(() => {})
        //     .catch(() => {});
        // }
      });
    },
  },
};
</script>

<style lang="less" scoped>
#goodDetail {
  background: #f5f5f5;
  width: 100%;
  margin-bottom: 51px;
  .main {
    background: #fff;
    padding: 10px;
    img {
      width: 100%;
      display: block;
    }
    .price {
      height: 40px;
      line-height: 40px;
      background: #5684ff;
      color: #fff;
      text-align: left;
      padding-left: 15px;
    }
    .title1 {
      text-align: left;
      padding: 10px 15px;
      font-weight: 600;
      font-size: 18px;
    }
    .msg {
      color: #444;
      font-weight: 600;
      text-align: left;
      padding: 0px 15px;
      font-size: 15px;
    }
  }
  .type {
    margin-top: 10px;
    background: #fff;
    height: 40px;
    line-height: 40px;
    text-align: left;
    padding-left: 25px;
    color: #888;
    border-bottom: 2px solid #f5f5f5;
  }
  .tabBar {
    width: 100%;
    position: fixed;
    bottom: 0px;
    left: 0;
    li {
      // float: left;
      // width: 49.8%;
      height: 50px;
      line-height: 50px;
      background: #fff;
      color: #fff;
      background: #5684ff;
      box-shadow: 1px 0px 8px #888;
      font-size: 18px;
      // &:first-child {
      //   border-right: 1px solid #5684ff;
      // }
      i {
        font-size: 20px;
      }
    }
  }
  @font-face {
    font-family: "iconfont"; /* Project id 3184220 */
    src: url("//at.alicdn.com/t/font_3184220_c4yacfhntu.woff2?t=1645955545525")
        format("woff2"),
      url("//at.alicdn.com/t/font_3184220_c4yacfhntu.woff?t=1645955545525")
        format("woff"),
      url("//at.alicdn.com/t/font_3184220_c4yacfhntu.ttf?t=1645955545525")
        format("truetype");
  }
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
</style>