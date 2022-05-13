<template>
  <div id="finance">
    <div class="main">
      <!-- 总投资资产 -->
      <div class="assets">
        <p class="title">中国雄鸡银行，为您优选</p>
        <p>
          总投资资产(元)
          <!-- 总资产不可见 -->
          <i class="iconfont" @click="lookMoney" v-show="!isShow">&#xe64e;</i>
          <!-- 可见 -->
          <i class="iconfont" @click="downMoney" v-show="isShow">&#xe607;</i>
          <span class="iconfont" @click="gotoPosition()">&#xe75e;</span>
        </p>
        <h2 v-show="isShow">{{ assets | formatMoney1 }}</h2>
        <h2 v-show="!isShow">******</h2>
      </div>
      <!-- 图标 -->
      <ul class="lists">
        <li v-for="list in lists" :key="list.id">
          <img :src="list.img" alt="" />
          <p>{{ list.name }}</p>
        </li>
      </ul>
      <!-- 轮播图 -->
      <div class="banner">
        <el-carousel trigger="click" height="150px">
          <el-carousel-item v-for="item in 4" :key="item"> </el-carousel-item>
        </el-carousel>
      </div>
      <!-- 理财精选 -->
      <div class="finance" v-show="financeShow">
        <p class="fTitle">
          <img src="@/assets/finance/基金.png" alt="" />
          理财精选
        </p>
        <!-- 理财产品 -->
        <ul class="fLists">
          <li v-for="(product, index) in products" :key="product.id">
            <p class="flTitle">{{ product.pName }}</p>
            <ul>
              <li v-for="pList in product.pLists" :key="pList.id">
                <p>{{ pList.name }}</p>
                <p class="colorStyle">{{ pList.value }}</p>
              </li>
              <!-- 动态传参 -->
              <router-link
                :to="{ path: '/ProductDetail', query: { index: index } }"
              >
                <li class="buy colorStyle">购买</li>
              </router-link>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <Navigation></Navigation>
  </div>
</template>

<script>
import Navigation from "../components/Navigation.vue";
import { getFinanceList,hodeFinance } from "../api/api";
export default {
  name: "Finance",
  components: {
    Navigation,
  },
  data() {
    return {
      isShow: false, //总资产是否可见
      assets: 0,
      financeShow: true,
      lists: [
        {
          img: require("@/assets/finance/理财.png"),
          name: "理财",
        },
        {
          img: require("@/assets/finance/贵金属.png"),
          name: "贵金属",
        },
        {
          img: require("@/assets/finance/基金.png"),
          name: "基金",
        },
        {
          img: require("@/assets/finance/金融证券.png"),
          name: "证券",
        },
        {
          img: require("@/assets/finance/智能结售汇.png"),
          name: "结售汇",
        },
        {
          img: require("@/assets/finance/外汇买卖.png"),
          name: "外汇买卖",
        },
        {
          img: require("@/assets/finance/能源.png"),
          name: "账户能源",
        },
        {
          img: require("@/assets/finance/收藏.png"),
          name: "收藏",
        },
      ],
      products: [
        {
          pName: "笨鸟理财1号",
          pLists: [
            {
              name: "七日年化收益率(%)",
              value: "3.220%",
            },
            {
              name: "期限",
              value: "定期",
            },
            {
              name: "起购金额",
              value: "10万",
            },
          ],
        },
      ],
    };
  },
  methods: {
    // 开启眼睛，看总资产
    lookMoney() {
      this.isShow = true;
    },
    // 关闭眼睛，隐藏总资产
    downMoney() {
      this.isShow = false;
    },
    gotoPosition() {
      this.$router.push("/position");
    },
  },
  created() {
    // 获取理财产品
    getFinanceList().then((value) => {
      console.log(value);
      // 清空原数据
      this.products = [];
      if (value.code === 200) {
        value.data.forEach((el) => {
          // obj是单个理财产品
          let obj = {
            pName: "",
            pLists: [
              {
                name: "七日年化收益率(%)",
                value: "",
              },
              {
                name: "期限",
                value: "",
              },
              {
                name: "起购金额",
                value: "",
              },
            ],
          };
          obj.pName = el.name;
          el.rate = (Number(el.rate) * 100).toFixed(2) + "%";
          obj.pLists[0].value = el.rate;
          obj.pLists[1].value = el.type === "1" ? "活期" : "定期";
          obj.pLists[2].value = el.price;
          this.products.push(obj);
        });
      } else if (value.code === 500) {
        this.financeShow = false;
      }
    });
    //获取持仓信息
    hodeFinance("0").then((value) => {
      console.log(value);
      if (value.code === 200) {
        value.data.forEach(el=>{
          this.assets += Number(el.amount) * el.price;
        })
        sessionStorage.setItem("hodeFinance", JSON.stringify(value.data));
      }
    });
  },
  mounted() {
    // let assetsArr = JSON.parse(sessionStorage.getItem("hodeFinance")) || [];
    // assetsArr.forEach((el) => {
    //   this.assets += Number(el.amount) * el.price;
    // });
  },
};
</script>

<style lang="less" scoped>
#finance {
  margin-bottom: 50px;
  background: #f5f5f5;
  // 创建混合集，flex布局居中
  .center() {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .center1() {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .main {
    .assets {
      .title {
        font-size: 18px;
        letter-spacing: 2px;
        text-align: center;
        height: 40px;
        margin-left: 0px;
        margin-top: -10px;
        border-bottom: 1px solid #fff;
      }
      width: 100%;
      height: 158px;
      background-image: linear-gradient(
        -225deg,
        #b8dcff 0%,
        #5d9fff 48%,
        #6bbbff 100%
      );
      color: #fff;
      p {
        padding-top: 20px;
        margin-left: 60px;
        span {
          float: right;
          padding-right: 10px;
          font-size: 15px;
          line-height: 21px;
        }
      }
      h2 {
        padding-top: 10px;
      }
    }
    .lists {
      .center();
      flex: 1;
      flex-wrap: wrap;
      background: #fff;
      li {
        width: 92.8px;
        padding: 10px 0px;
        border-bottom: 1px solid #eee;
        border-right: 1px solid #eee;
        font-size: 15px;
      }
    }
    .banner {
      margin: 10px 0px;
      // 轮播图
      .el-carousel__item:nth-child(2n) {
        background: url("../assets/finance/banner3.jpeg") 100%;
      }
      .el-carousel__item:nth-child(2n + 1) {
        background: url("../assets/finance/banner2.jpeg");
      }
      .el-carousel__item:nth-child(3) {
        background: url("../assets/finance/banner2.jpeg") 100%;
      }
      .el-carousel__item:nth-child(4) {
        background: url("../assets/finance/banner.png");
      }
    }
    .finance {
      background: #fff;
      .fTitle {
        display: flex;
        align-items: center;
        text-align: left;
        padding: 10px 15px;
        font-size: 18px;
        border-bottom: 2px solid #f5f5f5;
        color: #5684ff;
        font-weight: bolder;
        img {
          padding-right: 10px;
        }
      }
      .fLists {
        li {
          .flTitle {
            text-align: left;
            padding: 10px 15px;
            font-size: 17px;
            font-weight: bold;
          }
          ul {
            .center();
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
            .colorStyle {
              color: #5684ff;
            }
            .buy {
              width: 58px;
              height: 28px;
              border-radius: 30px;
              border: 1px solid #5684ff;
              line-height: 28px;
            }
            p {
              padding: 2px 0px;
            }
          }
        }
      }
    }
  }
}
@font-face {
  font-family: "iconfont"; /* Project id 3184220 */
  src: url("//at.alicdn.com/t/font_3184220_q9rz39v4h1j.woff2?t=1645858518550")
      format("woff2"),
    url("//at.alicdn.com/t/font_3184220_q9rz39v4h1j.woff?t=1645858518550")
      format("woff"),
    url("//at.alicdn.com/t/font_3184220_q9rz39v4h1j.ttf?t=1645858518550")
      format("truetype");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 20px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>