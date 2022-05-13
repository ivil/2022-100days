<template>
  <div class="position">
    <div class="header">
      <acc-navigation :title="title" />
      <ul class="headerMenu">
        <li @click="which = 0"><h3>我的持仓</h3></li>
        <li @click="which = 1"><h3>历史记录</h3></li>
      </ul>
    </div>

    <div class="mainContent">
      <template v-if="which === 0">
        <!------- 持仓信息 ------>
        <div class="middle">
          <ul v-for="(item1, index) in hold" :key="index">
            <!------ 动态传参到持仓详情页 ----->
            <router-link
              :to="{
                path: '/PositionDetail',
                query: { index: index, type: item1.type },
              }"
            >
              <li>
                <h3>
                  {{ item1.hodeName }}
                  <span style="color: #23c3bd; float: right">{{
                    item1.type
                  }}</span>
                </h3>
                <div class="list1">
                  <p>
                    <span>持仓金额</span>
                    <span style="color: red">{{ item1.hodeMoney }}元</span>
                  </p>
                  <p>
                    <span>持有份数</span>
                    <span style="color: orange">{{ item1.hodeAmount }}份</span>
                  </p>
                  <p>
                    <span>年化利率(%)</span>
                    <span>{{ item1.hodeRate }}</span>
                  </p>
                </div>
              </li>
            </router-link>
          </ul>

          <!-- <ul>111</ul> -->
        </div>
      </template>

      <template v-if="which === 1">
        <!------ 赎回信息 ------>
        <div class="middle">
          <!-- <div class="p">历史记录</div> -->
          <div class="list" v-for="(item2, index1) in redeem" :key="index1">
            <li>
              <h3>{{ item2.backName }}</h3>
            </li>
            <li>
              <span> {{ item2.priceType }}: {{ item2.price }} </span>
              <span
                :style="
                  item2.type.indexOf('成功') != -1
                    ? { color: '#23C3BD' }
                    : item2.type.indexOf('失败') > -1
                    ? { color: 'red' }
                    : { color: 'orange' }
                "
              >
                {{ item2.type }}
              </span>
            </li>
            <li>交易时间: {{ item2.time }}</li>
          </div>
          <!-- <ul></ul> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { hodeFinance, backFinanceList } from "../../api/api";
import { Toast } from "vant";
export default {
  name: "Positiion",
  components: {
    AccNavigation,
  },
  data() {
    return {
      title: "我的资产",
      which: 0,
      // 持仓信息
      hold: [
        {
          hodeName: "",
          hodeMoney: "",
          hodeAmount: "",
          hodeRate: "",
          type: "",
        },
      ],
      // 赎回信息
      redeem: [
        {
          backName: "",
          time: "",
          type: "",
          priceType: "",
          price: 0,
        },
      ],
    };
  },

  methods: {
    click1() {
      this.$router.replace({ name: "PositionDetail" });
    },
  },
  watch: {
    which(newV, oldV) {
      let newEl = document.querySelectorAll(".headerMenu li")[newV];
      newEl.style.background = "#5684FF";
      newEl.style.color = "#fff";
      let oldEl = document.querySelectorAll(".headerMenu li")[oldV];
      oldEl.style.background = "#fff";
      oldEl.style.color = "#5684FF";
    },
  },
  mounted() {
    // 初始化导航栏菜单按钮
    let tempList = document.querySelectorAll(".headerMenu li");
    tempList[0].style.background = "#5684FF";
    tempList[0].style.color = "#fff";
    tempList[1].style.color = "#5684FF";
  },

  created() {
    //获取持仓信息
    hodeFinance("0").then((value) => {
      console.log(value);
      if (value.code === 200) {
        this.hold = [];
        sessionStorage.setItem("hodeFinance", JSON.stringify(value.data));
        value.data.forEach((element) => {
          let obj = {
            hodeName: element.name,
            hodeMoney: (Number(element.amount) * element.price).toFixed(2),
            hodeAmount: Number(element.amount).toFixed(2),
            hodeRate: (Number(element.rate) * 100).toFixed(2) + "%",
            type: "",
          };
          this.$store.commit(
            "getTotalAssets",
            Number(element.amount) * element.price
          );
          if (element.state === "0") {
            obj.type = "申购中";
          }
          this.hold.push(obj);
        });
      } else {
        Toast.fail(value.message);
      }
    });

    // 获取赎回信息
    backFinanceList().then((value) => {
      console.log(value);
      if (value.code === 200) {
        this.redeem = [];
        sessionStorage.setItem("backFinanceList", JSON.stringify(value.data)); //存入缓存
        value.data.forEach((element) => {
          let obj1 = {
            backName: element.name,
            priceType: "",
            type: "",
            time: element.time,
            price: element.price == null ? "正在确认" : element.price + "元",
          };
          if (element.type === "1") {
            obj1.priceType = "申购金额";
            obj1.type = "申购成功";
          }
          if (element.type === "2") {
            obj1.priceType = "赎回金额";
            obj1.type = "赎回成功";
          }
          if (element.type === "3") {
            obj1.priceType = "申购金额";
            obj1.type = "申购失败";
          }
          if (element.type === "4") {
            obj1.priceType = "赎回金额";
            obj1.type = "赎回失败";
          }
          if (element.type === "5") {
            obj1.priceType = "赎回金额";
            obj1.type = "申请赎回";
          }
          this.redeem.push(obj1);
        });
      } else {
        console.log(value.message);
      }
    });
  },
};
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
}
.mainContent {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  top: 120px;
}
.headerMenu {
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-size: large;
  margin-top: 20px;
  li {
    height: 45px;
    // background: #5684ff;
    border: 1px solid #5684ff;
    width: 180px;
    line-height: 45px;
    border-radius: 5px;
    h3 {
      display: inline-block;
      font-weight: 500;
      // color: #999;
    }
  }
}
@box-shadow: 0px 6px 12px #999;
.middle {
  // width: 100%;
  margin-top: 20px;
  ul {
    width: 94vw;
    // padding-top: 5px;
    margin-left: auto;
    margin-right: auto;
    margin: 10px;
    background: #f2f2f2;
    border-radius: 8px;
    // // width: 100%;
    // // height: 100px;
    // background: #f2f2f2;
    // // background: lightblue;
    // margin-bottom: 10px;
    // border-radius: 8px;
    li {
      // width: 94vw;
      // margin: 5px auto;
      h3 {
        text-align: left;
        padding: 10px 15px;
        font-size: 20px;
        color: #000;
      }
    }
  }
}

.list1 {
  // width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  padding: 0px 15px;
  // margin-top: 50px;
  p {
    // width: 110px;
    height: 70px;
    span {
      display: block;
      width: 100%;
      height: 32px;
      margin-bottom: 2px;
      font-size: 18px;
      line-height: 32px;
      color: #000;
      &:nth-of-type(2) {
        font-size: 22px;
      }
    }
  }
}

.list {
  // width: 94vw;
  // padding-top: 5px;
  // margin-left: auto;
  // margin-right: auto;
  margin: 10px;
  background: #f2f2f2;
  border-radius: 8px;
  li {
    display: flex;
    justify-content: space-between;
    align-content: center;
    height: 39px;
    line-height: 40px;
    padding: 0px 15px;
    h3 {
      font-size: 20px;
      color: #000;
    }
    span {
      font-size: 20px;
      // &:nth-child(1) {
      //   color: red;
      // }
      // &:nth-child(2) {
      //   color: orange;
      // }
    }
  }
}
</style>