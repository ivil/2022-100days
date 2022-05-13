<template>
  <div id="me">
    <!--------------------------------- 头部 --------------------------------->
    <div class="top">
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
    <div class="main_1">
      <!--------------------------------- 登录 --------------------------------->
      <div class="login">
        <ul>
          <li>{{ username }}</li>
          <li>欢迎来到中国雄鸡银行</li>
        </ul>
        <!---- 头像 ---->
        <div class="avatar" @click.stop="changeAvatar">
          <img :src="avatar" alt="" />
          <div class="iconfont learnMore">&#xe75e;</div>
        </div>
      </div>
      <!--------------------------------- 权益中心 --------------------------------->
      <div class="equity">
        <ul class="title">
          <li>权益中心</li>
          <li>
            更多
            <i class="iconfont learnMore">&#xe75e;</i>
          </li>
        </ul>
        <ul class="list">
          <li v-for="list in lists" :key="list.id" @click="gotoPage(list)">
            <p>{{ list.num }}</p>
            {{ list.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="main_2">
      <!--------------------------------- 总资产 --------------------------------->
      <div class="assets">
        <div class="title">
          <div>
            总资产(元)
            <!-- 总资产不可见 -->
            <i class="iconfont invisible" @click="lookMoney" v-if="!isShow"
              >&#xe64e;</i
            >
            <!-- 可见 -->
            <i
              class="iconfont invisible visible"
              @click="downMoney"
              v-if="isShow"
              >&#xe607;</i
            >
          </div>
          <p v-if="!isShow">******</p>
          <p v-if="isShow">{{ money }} 元</p>
        </div>

        <!--------------------------------- 资产占比 & 资产详情 --------------------------------->
        <div class="sector" v-show="isShow">
          <el-tabs stretch v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="资产占比" name="first" class="first">
              <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
              <div
                id="main1"
                style="float: left; width: 100%; height: 300px"
              ></div>
            </el-tab-pane>
            <el-tab-pane label="资产详情" name="second" class="second">
              <div class="balance">
                <span>电子账户余额</span>
                <span class="money">{{ balance }} 元</span>
              </div>
              <div class="balance" v-for="cards in cardsList" :key="cards.id">
                <span>{{ cards.name }}</span>
                <span class="money">{{ cards.value }} 元</span>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <Navigation></Navigation>
  </div>
</template>

<script>
import Navigation from "../components/Navigation.vue";
import { getAccountList, record, getUserInfo } from "../api/api";
let echarts = require("echarts/lib/echarts");
// 引入饼状图组件
require("echarts/lib/chart/pie");
import { LegendComponent } from "echarts/components";
echarts.use([LegendComponent]);

export default {
  name: "Me",
  components: {
    Navigation,
  },
  data() {
    return {
      username: "",
      avatar: require("@/assets/me/avatar1.jpg"), //默认头像
      isShow: true, //总资产是否可见
      input1: "",
      money: 0, //后端传来的数据（总资产）
      activeName: "first",
      percentage: 100, //进度条的百分比和颜色
      customColor: "rgb(183, 48, 224)",
      cardsList: [], //资产详情
      balance: "",
      lists: [
        //权益中心
        {
          num: "0",
          name: "银行卡",
          path: "/deal/card",
        },
        {
          num: "0",
          name: "积分",
          path: "/integral",
        },
        {
          num: "0",
          name: "交易记录",
          path: "deal/record",
        },
      ],
      cardChart: [],
    };
  },
  methods: {
    // 绘制总资产扇形图
    initData() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main1"));
      // 绘制图表
      myChart.setOption({
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "余额",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false, //中心不显示信息
              position: "center",
              formatter: "{b} : {c} ({d}%)",
            },
            emphasis: {
              label: {
                show: true, //显示格式化的格式
                fontSize: "15",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: true,
            },
            data: this.cardChart,
          },
        ],
      });
    },
    // 点击权益中心，跳转到不同的页面
    gotoPage(list) {
      this.$router.push(list.path);
    },
    // 开启眼睛，看总资产
    lookMoney() {
      this.isShow = true;
    },
    // 关闭眼睛，隐藏总资产
    downMoney() {
      this.isShow = false;
    },
    handleClick(tab, event) {
      console.log(event);
      // console.log(tab);
      console.log(tab.index);
      if (tab.index === "1") {
        // console.log("资产详情");
      } else {
        // console.log("资产占比");
      }
    },
    // 点击头像，跳转到个人信息界面
    changeAvatar() {
      this.$router.push("/information");
    },
    // 点击设置按钮，跳转到设置页面
    gotoSettings() {
      this.$router.push("/settings");
    },
  },
  created() {
    // 发送axios请求，获取绑定的银行卡数
    getAccountList().then(
      (value) => {
        if (value.code === 200) {
          console.log(value.data);
          this.lists[0].num = value.data.length;
          sessionStorage.setItem("cardList", JSON.stringify(value.data));
          // 将所有卡的信息存入vuex中
          this.$store.commit("getcardList", value.data);
          // 从vuex中获取卡号和余额，填入扇形图
          this.$store.state.cardList.forEach((element) => {
            console.log(element);
            let obj = {
              value: "",
              name: "",
            };
            obj.value = element.money;
            // 计算出总资产
            this.money = Number(this.money) + Number(element.money);
            // 脱敏显示卡号
            let accountId =
              element.id.substring(0, 4) +
              "****" +
              element.id.substring(element.id.length - 4);
            obj.name = accountId;
            this.cardChart.push(obj); //资产占比（扇形图）
            this.cardsList.push(obj); //资产详情
          });
          // 总资产保留两位小数
          this.money = Number(this.money).toFixed(2);
          //显示出总资产扇形图
          this.initData();
        } else {
          console.log(value);
        }
      },
      (reason) => {
        console.log(reason);
      }
    );
    // 获取交易记录
    record().then(
      (value) => {
        sessionStorage.setItem("recordList", JSON.stringify(value.data));
        try {
          this.lists[2].num = value.data.length;
        } catch (e) {}
      },
      (reason) => {
        console.log(reason);
      }
    );

    // 显示出头像
    try {
      let avatar = JSON.parse(window.localStorage.getItem("avatar")).avatar;
      if (window.localStorage.getItem("avatar")) {
        this.avatar = avatar;
      }
    } catch (e) {}

    // 访问控制
    getUserInfo().then(
      (value) => {
        if (value.code === 200) {
          sessionStorage.setItem("user", JSON.stringify(value.data));
          let userData = value.data;
          this.lists[1].num = userData.score;
          if (userData.username === null) {
            this.username = "亲爱的用户";
          } else {
            this.username = "亲爱的 " + userData.username;
          }
          let obj = {
            value: "",
            name: "",
          };
          obj.value = userData.money;
          this.balance = userData.money; //资产详情，电子账户余额
          obj.name = "电子账户";
          this.cardChart.push(obj);
          this.money = Number(this.money) + Number(userData.money);
          this.money = Number(this.money).toFixed(2);
        }
      },
      (reason) => {
        console.log(reason);
      }
    );
  },
  watch: {
    // 监听总资产
    money() {
      this.initData();
    },
  },
};
</script>

<style lang="less" scoped>
#me {
  // background: #f5f5f5;
  // 创建混合集，flex布局居中
  margin-bottom: 35px;
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
  // 创建混合集，留出左右空余位置，设置背景色
  .margin() {
    padding: 0px 12px;
    background: #fff;
  }
  .top {
    height: 50px;
    line-height: 50px;
    padding: 0px 3px 0px 6px;
    background: #fff;
    border-bottom: 1px solid #dedede;
    .center();
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
  .main_1 {
    .margin();
    padding-top: 30px;
    .learnMore {
      font-size: 14px;
    }
    .login {
      .center1();
      ul {
        li {
          text-align: left;
          &:first-child {
            font-size: 20px;
            letter-spacing: 2px;
            padding: 0px 0px 2px 0px;
          }
          &:last-child {
            // font-size: 16px;
            letter-spacing: 1px;
          }
        }
      }
      .avatar {
        .center();
        img {
          width: 65px;
          border-radius: 50%;
          margin: 0px 15px;
        }
        div {
          color: #aaa;
        }
      }
    }
    .equity {
      padding-top: 20px;
      margin-top: 20px;
      border-top: 2px solid #f5f5f5;
      border-bottom: 1px solid #dedede;
      .title {
        .center1();
        li {
          &:first-child {
            font-size: 18px;
            letter-spacing: 1px;
          }
          &:last-child {
            font-size: 15px;
            color: #aaa;
          }
        }
      }
      .list {
        .center();
        height: 80px;
        margin: 15px auto;
        border-radius: 10px;
        // 渐变色
        background: #56ccf2; /* fallback for old browsers */
        background: -webkit-linear-gradient(
          to right,
          #2f80ed,
          #56ccf2
        ); /* Chrome 10-25, Safari 5.1-6 */
        background: linear-gradient(
          to right,
          #2f80ed,
          #56ccf2
        ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
        color: #fff;
        p {
          padding-bottom: 10px;
          letter-spacing: 2px;
        }
      }
    }
  }
  .main_2 {
    .margin();
    .title {
      .center1();
      padding-top: 20px;
      div {
        font-size: 18px;
        .invisible {
          color: #5684ff;
        }
      }
      p {
        font-size: 22px;
      }
    }
    .sector {
      margin-top: 20px;
      /deep/.el-tabs__item {
        font-size: 16px;
      }
      .second {
        margin-bottom: 25px;
        .balance {
          padding: 12px 0px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
  @font-face {
    font-family: "iconfont"; /* Project id 3184220 */
    src: url("//at.alicdn.com/t/font_3184220_hfaz31or7kh.woff2?t=1644981225616")
        format("woff2"),
      url("//at.alicdn.com/t/font_3184220_hfaz31or7kh.woff?t=1644981225616")
        format("woff"),
      url("//at.alicdn.com/t/font_3184220_hfaz31or7kh.ttf?t=1644981225616")
        format("truetype");
  }
  .iconfont {
    font-family: "iconfont" !important;
    font-size: 26px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}
</style>