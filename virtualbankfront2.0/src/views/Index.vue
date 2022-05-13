<template>
  <div id="Index">
    <div class="top">
      <div class="search">
        <i class="iconfont">&#xe600;</i>
        <div class="demo-input-suffix">
          <el-input
            placeholder="请输入内容"
            prefix-icon="el-icon-search"
            suffix-icon="el-icon-microphone"
            v-model="input1"
          >
          </el-input>
        </div>
        <i class="iconfont" @click="gotoSettings">&#xe8b7;</i>
        <i class="iconfont">&#xe727;</i>
      </div>
    </div>

    <div class="middle">
      <!-- 轮播图 -->
      <div class="block">
        <el-carousel trigger="click" height="100px">
          <el-carousel-item v-for="item in 4" :key="item"> </el-carousel-item>
        </el-carousel>
      </div>

    <!-- 列表 -->
    <div class="list">
      <ul>
        <li v-for="(item1,index) in list" :key="index" @click="toclick(item1)">
          <img :src="item1.path" alt="">
          <p>{{item1.name}}</p>
        </li>
      </ul>
    </div>

    <div class="list2">
      <p>
        <lottie :options="defaultOptions" :height="120" :width="160" v-on:animCreated="handleAnimation" />
      </p>
      <p>
        <ul>
          <li>
            <h5>测测额度</h5>
            <span>测一测能贷多少钱</span>
          </li>
          <li>
            <h5>量身推荐</h5>
            <span>看看能贷哪些产品</span>
          </li>
        </ul>
      </p>
    </div>

    <div class="list3">
      <p>存款无忧</p>
      <p><i class="el-icon-arrow-right"></i></p>
    </div>
    <div class="list4">
      <ul>
        <li>
          <h5>安心存</h5>
          <h3>3.5%</h3>
          <p>利率最高可存</p>
          <p>1万起存</p>
        </li>
        <li>
          <h5>安心存</h5>
          <h3>3.5%</h3>
          <p>利率最高可存</p>
          <p>1万起存</p>
        </li>
        <li>
          <h5>安心存</h5>
          <h3>3.5%</h3>
          <p>利率最高可存</p>
          <p>1万起存</p>
        </li>
      </ul>
    </div>

    <div class="list3">
      <p>热销理财</p>
      <p @click="toMore">更多<i class="el-icon-arrow-right"></i></p>
    </div>

    <div class="finance">
      <ul>
        <li v-for="(item,index) in products.slice(0,3)" :key="index">
          <h3 style="color: #546FFE;">{{item.name}}</h3>
          <div class="listType">
            <p>
              <span>年化利率</span>
              <span style="color:red;font-weight:700;">{{item.rate}}</span>
            </p>
            <p>
              <span>期限</span>
              <span style="color: #546FFE;">{{item.type}}</span>
            </p>
            <p>
              <span>起购金额</span>
              <span style="color: #546FFE;">{{item.money}}</span>
            </p>
          </div>
          <p class="p">{{item.description}}</p>
        </li>
      </ul>
    </div>

    </div> 

    <navigation></navigation>
  </div>
</template>

<script>
import Navigation from "../components/Navigation.vue";
import * as animationData from "../assets/jsonLogo/index.json";
import { getFinanceList } from "../api/api";
import { Toast } from "vant";

export default {
  components: { Navigation },
  name: "Index",
  data() {
    return {
      input1: "",
      // json
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 1,
      anim: {},

      // 列表
      list: [
        {
          path: require("../assets/index/充值.png"),
          name: "充值",
          name1: "/deal/recharge",
        },
        {
          path: require("../assets/index/提现.png"),
          name: "提现",
          name1: "/deal/withdraw",
        },
        {
          path: require("../assets/index/转账.png"),
          name: "转账",
          name1: "/deal/transfer",
        },
        {
          path: require("../assets/index/绑卡.png"),
          name: "绑卡",
          name1: "/bindCard",
        },
      ],

      // 理财产品
      products: [
        {
          // name:"笨鸟理财",
          // rate:"3.220%",
          // type:"活期",
          // money:"10万",
          // description:"111"
        },
      ],
    };
  },

  methods: {
    // 点击设置按钮，跳转到设置页面
    gotoSettings() {
      this.$router.push("/settings");
    },
    handleAnimation: function (anim) {
      this.anim = anim;
      console.log(anim); //这里可以看到 lottie 对象的全部属性
    },
    // 跳转
    toclick(item1) {
      this.$router.push(item1.name1);
    },
    // 
    toMore(){
      this.$router.push("/finance")
    }

  },

  created() {
    // 获取理财产品
    getFinanceList().then((value) => {
      console.log(value);
      // 清空数据
      this.products = [];
      if (value.code === 200) {
        value.data.forEach((element) => {
          let obj = {
            name: element.name,
            rate: (element.rate * 100).toFixed(2) + "%",
            type: element.type === "1" ? "活期" : "定期",
            money: element.price,
            description: element.description,
          };
          this.products.push(obj);
        });
      }
    });
  },
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-between;
}
#index {
  margin-bottom: 50px;
}
.search {
  position: fixed;
  z-index: 100;
  top: 0;
  //渐变色
  background: #56ccf2; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #2f80ed,
    #56ccf2
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #2f80ed, #56ccf2);
  height: 50px;
  line-height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  .demo-input-suffix {
    width: 260px;
    /deep/.el-input__inner {
      height: 35px;
      border-radius: 20px;
      background: #f6f6f6;
      border: none;
    }
    /deep/.el-input__icon {
      font-size: 18px;
      color: #aaa;
    }
  }
}
@font-face {
  font-family: "iconfont"; /* Project id 3184220 */
  src: url("//at.alicdn.com/t/font_3184220_g5vg7p3r3f4.woff2?t=1644906615604")
      format("woff2"),
    url("//at.alicdn.com/t/font_3184220_g5vg7p3r3f4.woff?t=1644906615604")
      format("woff"),
    url("//at.alicdn.com/t/font_3184220_g5vg7p3r3f4.ttf?t=1644906615604")
      format("truetype");
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 26px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.middle {
  width: 100%;
  height: auto;
  position: absolute;
  top: 50px;
}
// 轮播图
.block {
  width: 100%;
  margin-top: 10px;
}
.el-carousel__item {
  border-radius: 5px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background: url("../assets/index/t1.png");
}
.el-carousel__item:nth-child(2n + 1) {
  background: url("../assets/index/t2.png");
}
.el-carousel__item:nth-child(3) {
  background: url("../assets/images/bg6.png");
}
.el-carousel__item:nth-child(4) {
  background: url("../assets/index/t3.png");
}

.list {
  width: 100%;
  height: 80px;
  margin-top: 10px;
  ul {
    width: 94%;
    height: 80px;
    padding: 0 3%;
    .flex();
    li {
      width: 80px;
      height: 80px;
      img {
        width: 50px;
        height: 50px;
      }
      p {
        font-size: 18px;
      }
    }
  }
}

.list2 {
  width: 94%;
  padding: 3%;
  height: 120px;
  margin-top: 10px;
  .flex();
  p {
    // width: 160px;
    width: 48%;
    height: 120px;
    background: #56ccf2; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #2f80ed,
      #56ccf2
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #2f80ed, #56ccf2);
    border-radius: 5px;
    &:nth-of-type(2) {
      background: #fff;
      ul {
        li {
          width: 100%;
          padding-top: 5.5px;
          // background: #56CCF2;  /* fallback for old browsers */
          // background: -webkit-linear-gradient(to right, #2F80ED, #56CCF2);  /* Chrome 10-25, Safari 5.1-6 */
          // background: linear-gradient(to right, #2F80ED, #56CCF2);
          background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%);
          border-radius: 5px;
          letter-spacing: 3px;
          line-height: 1.5em;
          h5 {
            font-size: 20px;
          }
          span {
            font-size: 12px;
            color: rgb(22, 21, 21);
          }
          &:nth-of-type(2) {
            margin-top: 10px;
          }
        }
      }
    }
  }
}

.list3 {
  width: 94%;
  padding: 3%;
  height: 40px;
  .flex();
  align-items: center;
  p {
    // width: 100px;
    font-size: 18px;
    font-weight: 700;
    &:nth-child(2) {
      font-weight: 500;
    }
  }
}

.list4 {
  width: 100%;
  height: 100px;
  // 超出滚动
  // overflow-x: auto;
  // display: -webkit-box;
  // -webkit-overflow-scrolling: touch;
  ul {
    width: 100%;
    display: flex;
    justify-content: space-around;
    li {
      width: 100px;
      line-height: 1.5em;
      // background: lightcyan;
      background: #f2f2f2;
      padding-top: 4px;
      h5 {
        font-size: 16px;
      }
      h3 {
        font-size: 22px;
        color: #546ffe;
      }
      p {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
// 隐藏滚动条
// .list4::-webkit-scrollbar {
//   display: none;
// }

.finance {
  width: 100%;
  margin-bottom: 50px;
  ul {
    width: 94%;
    height: auto;
    padding: 0 3%;
    li {
      width: 100%;
      height: 130px;
      background: rgb(247, 244, 244);
      margin-bottom: 20px;
      h3 {
        text-align: left;
      }
    }
  }
}
.p {
  text-align: left;
  color: green;
}

.listType {
  width: 100%;
  height: 80px;
  .flex();
  p {
    width: 100px;
    height: 80px;
    span {
      display: block;
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
    }
  }
}
</style>