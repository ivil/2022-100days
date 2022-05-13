<template>
  <div id="productDetail">
    <acc-navigation :title="title" />
    <!-- 理财产品的信息 -->
    <div class="main">
      <div class="rate">
        <div class="p1">
          <p>{{ rateName }}</p>
          <p>风险等级: {{ risk }}</p>
        </div>
        <p class="risk">{{ moneyType }}</p>
        <p class="rete1">{{ rate }}</p>
        <p class="company">理财公司: {{ company }}</p>
      </div>
      <div class="detail">
        <ul>
          <li v-for="list in lists" :key="list.id">
            <p>{{ list.name }}</p>
            <p>{{ list.value }}</p>
          </li>
        </ul>
      </div>
      <!-- 利率折线图 -->
      <div class="chart">
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main1" style="width: 100%; height: 300px"></div>
      </div>
      <div class="feature">
        <p>产品特点</p>
        <ul>
          <li class="des">{{ description }}</li>
          <!-- <li v-for="feature in features" :key="feature.id">
            <p>{{ feature.name }}</p>
            <span>{{ feature.value }}</span>
          </li> -->
        </ul>
      </div>
    </div>
    <div class="buy" @click="buyProduct">购买</div>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { EncryptFront } from "../../utils/AES";
import { getFinanceList, getRateList } from "../../api/api";
let echarts = require("echarts/lib/echarts");
import { LineChart } from "echarts/charts";
echarts.use([LineChart]);
import { GridComponent } from "echarts/components";
echarts.use([GridComponent]);
export default {
  name: "ProductDetail",
  components: {
    AccNavigation,
  },
  data() {
    return {
      title: "",
      rateName: "七日年化收益率(%)",
      moneyType: "人民币",
      risk: "",
      rate: 0,
      company: "菜鸟",
      lists: [
        {
          name: "期限",
          value: "",
        },
        // {
        //   name: "收益类型",
        //   value: "非保本浮动收益",
        // },
        {
          name: "起购金额",
          value: 0,
        },
        // {
        //   name: "剩余份额",
        //   value: 0,
        // },
      ],
      description: "产品申购、赎回均免手续费。",
      financeId: "",
      rateChart: [],
      // features: [
      //   {
      //     name: "随时申赎",
      //     value: "该产品为活期理财产品，支持随时申购、赎回该产品。",
      //   },
      //   {
      //     name: "低风险",
      //     value: "本产品是货币市场型基金，是证券投资中的低风险品种。",
      //   },
      //   {
      //     name: "收益滚动",
      //     value: "收益每天结算，昨日收益一目了然。",
      //   },
      //   {
      //     name: "免手续费",
      //     value: "产品申购、赎回均免手续费。",
      //   },
      // ],
    };
  },
  methods: {
    // 返回上一步
    back() {
      this.$router.go(-1);
    },
    // 绘制总资产扇形图
    initData() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main1"));
      // 绘制图表
      myChart.setOption({
        xAxis: {
          type: "category",
          data: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: this.rateChart,
            type: "line",
          },
        ],
      });
    },
    // 购买产品
    buyProduct() {
      this.$router.push({
        path: "/buyProduct",
        query: {
          financeId: EncryptFront(this.financeId), //加密
          price: EncryptFront(this.lists[1].value), //起购金额
          rate: EncryptFront(this.rate),
        },
      });
    },
  },
  mounted() {
    // 获取理财详情
    getFinanceList().then((value) => {
      if (value.code === 200) {
        let thisData = value.data[this.$route.query.index];
        console.log(thisData);
        this.title = thisData.name;
        thisData.rate = (Number(thisData.rate) * 100).toFixed(2) + "%";
        this.rate = thisData.rate;
        this.lists[0].value = thisData.type === "1" ? "活期" : "定期";
        this.lists[1].value = thisData.price; //起购金额
        // this.lists[3].value = thisData.amount;
        this.description = thisData.description;
        this.financeId = thisData.id;
        this.risk = thisData.state;
        if (this.risk === "0") {
          this.risk = "低风险";
        } else if (this.risk === "1") {
          this.risk = "中风险";
        } else {
          this.risk = "高风险";
        }

        // 获取七日利率变化(利率折线图)
        let data = thisData.id;
        getRateList(data).then((value) => {
          console.log(value);
          if (value.code === 200) {
            // 将七日利率变化存入数组
            value.data.forEach((element) => {
              this.rateChart.push(element.rate);
            });
            //显示出利率折线图
            this.initData();
          }
        });
      }
    });
  },
};
</script>

<style lang="less" scoped>
#productDetail {
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
    .rate {
      width: 100%;
      height: 132px;
      background: #5684ff;
      color: #fff;
      .p1 {
        .center1();
        padding: 10px 15px 0px 15px;
      }
      .risk {
        text-align: right;
        padding: 0px 15px;
      }
      .rete1 {
        font-size: 30px;
        text-align: center;
        padding: 8px 0px;
      }
      .company {
        text-align: right;
        padding: 0px 15px;
      }
    }
    .detail {
      ul {
        .center();
        flex: 1;
        flex-wrap: wrap;
        background: #fff;
        padding-bottom: 6px;
        li {
          width: 170px;
          padding: 0px 8px;
          margin-top: 8px;
          border-left: 1px solid #c7c7c7;
          &:first-child {
            border-left: none;
          }
          &:nth-child(3) {
            border-left: none;
          }
          p {
            padding: 1px 0px;
            &:first-child {
              color: #888;
            }
          }
        }
      }
    }
    .chart {
      margin: 5px 0px;
      background: #fff;
    }
    .feature {
      margin-bottom: 45px;
      background: #fff;
      padding-top: 8px;
      p {
        font-size: 18px;
        color: #5684ff;
        text-align: left;
        padding-left: 15px;
      }
      .des {
        padding: 0px 0px 20px 15px;
      }
      ul {
        li {
          display: flex;
          text-align: left;
          margin-top: 10px;
          p {
            color: #2c3e50;
            width: 18%;
            padding: 5px 2px 0px 15px;
            font-size: 14px;
            border-right: 1px solid #ddd;
          }
          span {
            display: block;
            width: 82%;
            padding: 5px 8px;
            font-size: 14px;
          }
        }
      }
    }
  }
  .buy {
    width: 100%;
    height: 45px;
    background: #5684ff;
    border-radius: 5px;
    color: #fff;
    line-height: 45px;
    position: fixed;
    bottom: 0;
    left: 0;
  }
}
@font-face {
  font-family: "iconfont"; /* Project id 3184220 */
  src: url("//at.alicdn.com/t/font_3184220_54zjcig078o.woff2?t=1645155582274")
      format("woff2"),
    url("//at.alicdn.com/t/font_3184220_54zjcig078o.woff?t=1645155582274")
      format("woff"),
    url("//at.alicdn.com/t/font_3184220_54zjcig078o.ttf?t=1645155582274")
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