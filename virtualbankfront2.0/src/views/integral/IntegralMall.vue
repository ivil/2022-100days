<template>
  <div id="integralMall">
    <acc-navigation :title="title" />
    <!-- 轮播图 -->
    <div class="banner">
      <el-carousel trigger="click" height="150px">
        <el-carousel-item v-for="item in 4" :key="item"> </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 商品列表 -->
    <div class="goods">
      <p class="title1">积分兑换</p>
      <ul class="furniture">
        <li v-for="good in goods" :key="good.id" @click="goodDetail(good)">
          <img src="@/assets/integral/good3.jpg" alt="" />
          <h4>{{ good.name }}</h4>
          <p>{{ good.price }}积分</p>
        </li>
      </ul>
    </div>
    <!-- 底部导航栏 -->
    <!-- <ul class="tabBar">
      <li @click="gotoCart">
        <i class="el-icon-shopping-cart-full"></i>
        购物车
      </li>
      <li @click="gotoOrder">
        <i class="el-icon-document"></i>
        我的订单
      </li>
    </ul> -->
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { getGoods } from "../../api/api";
export default {
  name: "IntegralMall",
  components: {
    AccNavigation,
  },
  data() {
    return {
      title: "积分商城",
      goods: [],
    };
  },
  methods: {
    // 返回上一步
    back() {
      this.$router.go(-1);
    },
    // 点击查看商品详情
    goodDetail(good) {
      this.$router.push({
        path: "/goodDetail",
        query: {
          good: JSON.stringify(good),
        },
      });
    },
    // 点击购物车
    // gotoCart() {
    //   // this.$router.push("/cart");
    // },
    // // 点击我的订单
    // gotoOrder() {},
  },
  mounted() {
    // 获取积分商城商品列表
    getGoods().then((value) => {
      console.log(value);
      if (value.code === 200) {
        this.goods = [];
        value.data.forEach((element) => {
          let obj = {
            // path:"",
            goodId: "",
            name: "",
            price: "",
            stock: "",
            description: "",
          };
          // let url =`/img/${element.remark}.e9847fdf.jpg`;
          // let el = document.querySelectorAll('.furniture li img')[index];
          // el.src = url;
          // console.log(el);
          obj.goodId = element.id;
          obj.name = element.name;
          obj.price = element.price;
          obj.stock = element.stock;
          obj.description = element.description;
          this.goods.push(obj);
        });
      }
    });
  },
};
</script>

<style lang="less" scoped>
#integralMall {
  margin-bottom: 50px;
  .center() {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .banner {
    // 轮播图
    .el-carousel__item:nth-child(2n) {
      background: url("../../assets/integral/img1.jpg");
    }
    .el-carousel__item:nth-child(2n + 1) {
      background: url("../../assets/integral/img2.jpg");
    }
    .el-carousel__item:nth-child(3) {
      background: url("../../assets/integral/img3.jpg");
    }
    .el-carousel__item:nth-child(4) {
      background: url("../../assets/integral/img4.jpg");
    }
  }
  .goods {
    .title1 {
      margin-top: 2px;
      height: 50px;
      line-height: 50px;
      font-size: 18px;
      font-weight: bolder;
      padding: 0px 15px;
      color: #fff;
      background-image: linear-gradient(
        to right,
        #fff1eb 0%,
        #ace0f9 20%,
        #b49fda 50%,
        #ace0f9 80%,
        #fff1eb 100%
      );
    }
    .furniture {
      // .center();
      display: flex;
      flex-wrap: wrap;
      li {
        width: 33%;
        border-left: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        padding: 10px 0px;
        img {
          width: 110px;
        }
        p {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
  // .tabBar {
  //   width: 100%;
  //   position: fixed;
  //   bottom: 0px;
  //   left: 0;
  //   li {
  //     float: left;
  //     width: 49.8%;
  //     height: 50px;
  //     line-height: 50px;
  //     background: #fff;
  //     color: #5684ff;
  //     font-size: 18px;
  //     border-top: 1px solid #5684ff;
  //     &:first-child {
  //       border-right: 1px solid #5684ff;
  //     }
  //     i {
  //       font-size: 20px;
  //     }
  //   }
  // }
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