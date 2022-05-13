<template>
  <div id="integral">
    <acc-navigation :title="title" />
    <!-- 积分为空 -->
    <el-empty description="暂无账户积分" v-show="emptyShow"></el-empty>

    <!-- 有积分 -->
    <div class="integral" v-show="integralShow">
      <p>我的账户积分</p>
      <p>{{ integral }}</p>
    </div>

    <!-- 积分签到 -->
    <ul class="func">
      <li @click="signIn1">签到</li>
      <li @click="luckDraw">抽奖</li>
    </ul>

    <!-- 底部导航栏 -->
    <ul class="tabBar">
      <!-- <li @click="integralDetail">积分详情</li> -->
      <li @click="exchange">积分兑换</li>
    </ul>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { signIn } from "../../api/api";
export default {
  name: "Integral",
  components: {
    AccNavigation,
  },
  data() {
    return {
      title: "我的积分",
      emptyShow: true, //积分为0，空状态显示
      integralShow: false, //积分显示
      integral: 0, //积分
    };
  },
  methods: {
    // 返回上一步
    back() {
      this.$router.go(-1);
    },
    // 点击签到，发送axios请求
    signIn1() {
      signIn().then((value) => {
        console.log(value);
        if (value.code === 200) {
          this.$alert("签到成功", "提示", {
            confirmButtonText: "确定",
            type: "primary",
          })
            .then(() => {
              // 将用户信息存进缓存（更新缓存）
              sessionStorage.setItem("user", JSON.stringify(value.data));
              this.integral = value.data.score;
            })
            .catch(() => {});
        } else if (value.code === 500) {
          // 提示：当日已签到
          this.$alert(`${value.message}`, "提示", {
            confirmButtonText: "确定",
            type: "primary",
          })
            .then(() => {})
            .catch(() => {});
        }
      });
    },
    // 点击抽奖
    luckDraw() {
      this.$router.push({
        path: "/luckDraw",
      });
    },
    // 点击积分详情
    // integralDetail() {},
    // 点击积分兑换
    exchange() {
      this.$router.push("/integralMall");
    },
  },
  mounted() {
    // 获取积分
    this.integral = JSON.parse(sessionStorage.getItem("user")).score;
  },
  watch: {
    // 对积分进行监听
    integral: {
      handler() {
        if (this.integral === 0) {
          this.emptyShow = true;
          this.integralShow = false;
        } else {
          this.integralShow = true;
          this.emptyShow = false;
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="less" scoped>
#integral {
  background-image: linear-gradient(to bottom, #fff 2%, #4facfe 100%);
  width: 100%;
  height: 100%;
  position: fixed;
  .center() {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .integral {
    padding: 64px;
    p {
      font-size: 20px;
      padding: 20px;
      &:last-child {
        font-size: 55px;
        color: #5684ff;
      }
    }
  }
  /deep/.el-empty__description p {
    font-size: 18px;
  }
  .func {
    .center();
    justify-content: space-around;
    position: relative;
    top: 50px;
    left: 0;
    li {
      width: 120px;
      height: 50px;
      line-height: 50px;
      color: #fff;
      font-size: 20px;
      background: #c1d4ff;
      // background-image: linear-gradient(130deg, #dbe0e9 0%, #79acff 100%);
      border-radius: 5px;
    }
  }
  .tabBar {
    width: 100%;
    position: fixed;
    bottom: 0px;
    left: 0;
    li {
      font-size: 18px;
      // float: left;
      // width: 49.8%;
      height: 50px;
      line-height: 50px;
      background: #fff;
      color: #5684ff;
      // &:first-child {
      //   border-right: 1px solid #5684ff;
      // }
    }
  }
  @font-face {
    font-family: "iconfont"; /* Project id 3184220 */
    src: url("//at.alicdn.com/t/font_3184220_csy06wesq65.woff2?t=1645958680293")
        format("woff2"),
      url("//at.alicdn.com/t/font_3184220_csy06wesq65.woff?t=1645958680293")
        format("woff"),
      url("//at.alicdn.com/t/font_3184220_csy06wesq65.ttf?t=1645958680293")
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