<template>
  <div class="positionDetail">
    <acc-navigation :title="title" />
    <div class="middle">
      <ul>
        <li v-for="(item, index) in messageList" :key="index">
          <p>{{ item.name }}</p>
          <p>{{ item.msg }}</p>
        </li>
      </ul>
    </div>
    <!------ 动态传参到产品赎回页面 ----->
    <div class="footer" @click="click" v-show="isShow">赎回</div>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { hodeFinance } from "../../api/api";
import Navigation from "../../components/Navigation.vue";
export default {
  name: "PositionDetail",
  components: {
    AccNavigation,
    Navigation,
  },
  data() {
    return {
      title: "持仓详情",
      state: "",
      isShow: true,
      type: this.$route.query.type,
      messageList: [
        {
          name: "投资份额",
          msg: "",
        },
        {
          name: "投资金额",
          msg: "",
        },
        {
          name: "购买时间",
          msg: "",
        },
        {
          name: "年化利率",
          msg: "",
        },
        {
          name: "产品单价",
          msg: 0,
        },
        {
          name: "状态",
          msg: "",
        },
      ],
    };
  },
  methods: {
    click() {
      // 判断是否同意赎回
      if (this.state === "1") {
        this.$router.push({
          name: "Back",
          query: {
            index: this.$route.query.index,
            amount: this.messageList[0].msg,
          },
        });
      } else {
        this.$alert("赎回申请中,请稍后", {
          confirmButtonText: "确定",
          callback: (action) => {
            this.$router.push({ name: "Position" });
          },
        });
      }
    },

    back() {
      this.$router.go(-1);
    },
  },
  created() {
    if (this.type === "申购中") {
      this.isShow = false;
    }
    hodeFinance("0").then((value) => {
      console.log(value);
      if (value.code === 200) {
        // 获取持仓产品详情
        sessionStorage.setItem("hodeFinance", JSON.stringify(value.data));
        let thisData = value.data[this.$route.query.index];
        console.log(thisData);
        this.title = thisData.name;
        this.messageList[0].msg = Number(thisData.amount);
        this.messageList[1].msg = (
          Number(thisData.amount) * thisData.price
        ).toFixed(2);
        this.messageList[2].msg = thisData.createTime;
        this.messageList[3].msg = thisData.rate;
        this.messageList[4].msg = thisData.price.toFixed(2);
        this.messageList[5].msg =
          thisData.type === "1" ? "活期,可赎回" : "定期";
        this.state = thisData.state;
        this.$store.commit(
          "getSingleAssets",
          Number(thisData.amount) * thisData.price
        );
      }
    });
  },

  // mounted() {
  //   hodeFinance("0").then((value) => {
  //     console.log(value);
  //     if (value.code === 200) {
  //       // 获取持仓产品详情
  //       sessionStorage.setItem("hodeFinance", JSON.stringify(value.data));
  //       let thisData = value.data[this.$route.query.index];
  //       console.log(thisData);
  //       // this.title = thisData.financeName;
  //       this.messageList[0].msg = Number(thisData.amount);
  //       this.messageList[1].msg = (
  //         Number(thisData.amount) * thisData.price
  //       ).toFixed(2);
  //       this.messageList[2].msg = thisData.createTime;
  //       this.messageList[3].msg = thisData.rate;
  //       this.messageList[5].msg =
  //         thisData.type === "1" ? "活期,可赎回" : "定期";
  //       this.state = thisData.state;
  //       this.$store.commit(
  //         "getSingleAssets",
  //         Number(thisData.amount) * thisData.price
  //       );
  //     }
  //   });
  // },
};
</script>

<style lang="less" scoped>
.middle {
  ul {
    width: 100%;
    li {
      width: 90%;
      height: 60px;
      padding: 0 5%;
      margin-top: 10px;
      border-bottom: 1px solid #999;
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 20px;
        color: rgb(56, 55, 55);
        &:nth-of-type(2) {
          color: #5684ff;
        }
      }
    }
  }
}
.footer {
  width: 98%;
  height: 60px;
  margin: auto;
  left: 0;
  right: 0;
  bottom: 60px;
  position: absolute;
  color: #fff;
  background: #5684ff;
  line-height: 60px;
  font-size: 22px;
  letter-spacing: 5px;
  border-radius: 5px;
}

/deep/.el-button--primary {
  background: #5684ff !important;
}
</style>
<style lang="less">
/deep/.el-button--primary {
  background: #5684ff !important;
}
</style>