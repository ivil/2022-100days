<template>
  <div class="luckDraw">
    <acc-navigation :title="title" />
    <div class="lucky-wheel">
      <div class="lucky-title"></div>
      <div class="wheel-main">
        <div class="wheel-pointer" @click="beginRotate()"></div>
        <div class="wheel-bg" :style="rotateStyle">
          <div class="prize-list">
            <div
              class="prize-item"
              v-for="(item, index) in prizeList"
              :key="index"
              :style="item.style"
            >
              <div class="prize-pic">
                <img :src="item.icon" />
              </div>
              <div class="prize-type">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="main">
      <div class="main-bg"></div>
      <div class="bg-p"></div>
      <div class="integral">积分剩余：{{ surplusIntegral1 }}</div>
      <div class="tip">
        <div class="tip-title">活动规则</div>
        <div class="tip-content">
          <p>1.积分抽奖，每10积分可兑换一次大转盘机会。</p>
        </div>
      </div>
    </div>
    <div class="toast" v-show="prize">
      <div class="toast-container">
        <img :src="toastIcon" class="toast-picture" />
        <div class="close" @click="closeToast()"></div>
        <div class="toast-title">{{ toastTitle }}</div>
        <div class="toast-btn">
          <div class="toast-cancel" @click="closeToast">关闭</div>
        </div>
      </div>
    </div>
    <div class="toast-mask" v-show="prize"></div>
  </div>
</template>
<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { prizeList } from "../../utils/luckDraw";
import { luckDraw } from "../../api/api";
const CIRCLE_ANGLE = 360;

const config = {
  // 总旋转时间
  duration: 2000,
  // 旋转圈数
  circle: 5,
  mode: "ease-in-out",
};

export default {
  name: "LuckDraw",
  components: {
    AccNavigation,
  },
  data() {
    return {
      title: "积分抽奖",
      surplusIntegral1: 0, //剩余积分
      duration: 3000, // 转盘旋转时间
      prizeList: [], // 奖品列表
      rotateAngle: 0, // 旋转角度
      index: 0,
      prize: null,
    };
  },
  created() {
    // 初始化一些值
    this.angleList = [];
    // 是否正在旋转
    this.isRotating = false;
    // 基本配置
    this.config = config;
    // 获取奖品列表
    this.initPrizeList();
  },
  computed: {
    rotateStyle() {
      return `
        -webkit-transition: transform ${this.config.duration}ms ${this.config.mode};
        transition: transform ${this.config.duration}ms ${this.config.mode};
        -webkit-transform: rotate(${this.rotateAngle}deg);
            transform: rotate(${this.rotateAngle}deg);`;
    },
    toastTitle() {
      return this.prize && this.prize.isPrize === 1
        ? "恭喜您，获得" + this.prize.name
        : "谢谢参与！";
    },
    toastIcon() {
      return this.prize && this.prize.isPrize === 1
        ? require("../../assets/img/congratulation.png")
        : require("../../assets/img/sorry.png");
    },
  },
  methods: {
    initPrizeList() {
      // 奖品数据
      this.prizeList = this.formatPrizeList(prizeList);
    },
    // 格式化奖品列表，计算每个奖品的位置
    formatPrizeList(list) {
      // 记录每个奖的位置
      const angleList = [];

      const l = list.length;
      // 计算单个奖项所占的角度
      const average = CIRCLE_ANGLE / l;

      const half = average / 2;

      // 循环计算给每个奖项添加style属性
      list.forEach((item, i) => {
        // 每个奖项旋转的位置为 当前 i * 平均值 + 平均值 / 2
        const angle = -(i * average + half);
        // 增加 style
        item.style = `-webkit-transform: rotate(${angle}deg);
                      transform: rotate(${angle}deg);`;

        // 记录每个奖项的角度范围
        angleList.push(i * average + half);
      });

      this.angleList = angleList;

      return list;
    },
    // 开始转盘
    beginRotate() {
      // 发送axios请求
      let data = {
        userId: JSON.parse(sessionStorage.getItem("user")).id,
        type: "lottery",
      };
      luckDraw(data).then((value) => {
        console.log(value);
        if (value.code === 200) {
          this.surplusIntegral1 = value.data.score;
          // 更新缓存（积分）
          let tempdata = JSON.parse(sessionStorage.getItem("user"));
          tempdata.score = value.data.score;
          sessionStorage.setItem("user", JSON.stringify(tempdata));
        }
      });

      // 添加次数校验（如果积分少于10，不能抽奖）
      if (this.surplusIntegral1 < 10) {
        this.$alert(`积分不足，无法抽奖！`, "提示", {
          confirmButtonText: "确定",
          type: "primary",
        })
          .then(() => {})
          .catch(() => {});
        return;
      }

      // 随机获取下标
      this.index = this.random(this.prizeList.length - 1);

      // 开始旋转
      this.rotating();
    },
    random(max, min = 0) {
      return parseInt(Math.random() * (max - min + 1) + min);
    },
    rotating() {
      const { isRotating, angleList, config, rotateAngle, index } = this;

      if (isRotating) return;

      this.isRotating = true;

      // 计算角度
      const angle =
        // 初始角度
        rotateAngle +
        // 多旋转的圈数
        config.circle * CIRCLE_ANGLE +
        // 奖项的角度
        angleList[index] -
        (rotateAngle % CIRCLE_ANGLE);

      this.rotateAngle = angle;

      // 旋转结束后，允许再次触发
      setTimeout(() => {
        this.rotateOver();
      }, config.duration + 1000);
    },
    // 转盘结束
    rotateOver() {
      console.log("转盘结束。。。。");
      this.isRotating = false;
      this.prize = prizeList[this.index];
      console.log(this.prize, this.index);
      // 转盘结束，获得奖品，加积分
      if (this.prize.name.length == 4) {
        var one1 = this.prize.name.split("")[0];
        var one2 = this.prize.name.split("")[1];
        var all = Number(one1 + one2);
        console.log(all);
      } else if (this.prize.name.length == 3) {
        var two1 = Number(this.prize.name.split("")[0]);
        console.log(two1);
      }

      // 发送axios请求，将获奖积分传给后端
      let data = {
        userId: JSON.parse(sessionStorage.getItem("user")).id,
        type: "winAward",
        integral: this.prize.name.length == 4 ? all : two1 || 0,
      };
      luckDraw(data).then((value) => {
        console.log(value);
        if (value.code === 200) {
          this.surplusIntegral1 = value.data.score;
          // 更新缓存（积分）
          let tempdata = JSON.parse(sessionStorage.getItem("user"));
          tempdata.score = value.data.score;
          sessionStorage.setItem("user", JSON.stringify(tempdata));
        }
      });
    },
    //关闭弹窗
    closeToast() {
      this.prize = null;
    },
  },
  // 查询剩余积分
  mounted() {
    let data = {
      userId: JSON.parse(sessionStorage.getItem("user")).id,
      type: "query",
    };
    luckDraw(data).then((value) => {
      console.log(value);
      if (value.code === 200) {
        this.surplusIntegral1 = value.data.score;
      }
    });
  },
};
</script>
<style scoped>
.container {
  width: 100%;
}
.lucky-wheel {
  width: 100%;
  background: rgb(252, 207, 133) url("../../assets/img/color_pillar.png")
    no-repeat center bottom;
  background-size: 100%;
  padding-top: 20px;
  margin-top: -10px;
}
.lucky-title {
  width: 100%;
  height: 8.125rem;
  background: url("../../assets/img/lucky_title.png") no-repeat center top;
  background-size: 100%;
}
.wheel-main {
  margin: 0 auto;
  position: relative;
  width: 295px;
  height: 295px;
}
.wheel-bg {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background: url("../../assets/img/draw_wheel.png") no-repeat center top;
  background-size: 100%;
  color: #fff;
}
.wheel-pointer {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  width: 85px;
  height: 85px;
  background: url("../../assets/img/draw_btn.png") no-repeat center top;
  background-size: 100%;
  transform: translate3d(-50%, -50%, 0);
}
.wheel-bg div {
  text-align: center;
}
.prize-list {
  width: 100%;
  height: 100%;
  position: relative;
}
.prize-list .prize-item {
  position: absolute;
  width: 95px;
  height: 150px;
  top: 0;
  left: 50%;
  margin-left: -47.5px;
  transform-origin: 50% 100%;
}
.prize-pic img {
  width: 4.0625rem;
  height: 2.5rem;
  margin-top: 1.5625rem;
}
.prize-count {
  font-size: 0.875rem;
}
.prize-type {
  font-size: 0.75rem;
}
.main {
  position: relative;
  width: 100%;
  min-height: 20.1rem;
  /* min-height: 12rem; */
  background: rgb(243, 109, 86);
  padding-bottom: 1.6875rem;
}
.main-bg {
  width: 100%;
  height: 6.5625rem;
  position: absolute;
  top: -3.4375rem;
  left: 0;
  background: url("../../assets/img/luck_bg.png") no-repeat center top;
  background-size: 100%;
}
.bg-p {
  width: 100%;
  height: 2.95rem;
  background: rgb(252, 207, 133);
}
.integral {
  padding-top: 15px;
  color: #ffe3c3;
  font-size: 18px;
}
.content {
  position: absolute;
  top: 0.175rem;
  left: 0;
  background: rgb(243, 109, 86);
  width: 100%;
  height: 5.1875rem;
  font-size: 1.125rem;
  color: #ffeb39;
  padding-left: 6.75rem;
}
.content div {
  text-align: left;
}
.tip {
  position: relative;
  margin: 2.05rem auto 0;
  width: 17.5rem;
  border: 1px solid #fbc27f;
}
.tip-title {
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 1rem;
  color: #fccc6e;
  background: rgb(243, 109, 86);
  padding: 0.3125rem 0.625rem;
}
.tip-content {
  padding: 1.5625rem 0.625rem;
  font-size: 0.875rem;
  color: #fff8c5;
  line-height: 1.5;
}
.toast-mask {
  position: fixed;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
  width: 100%;
  height: 100%;
}
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 20000;
  transform: translate(-50%, -50%);
  width: 15.4375rem;
  background: #fff;
  border-radius: 0.3125rem;
  padding: 0.3125rem;
  background-color: rgb(252, 244, 224);
}
.toast-container {
  position: relative;
  width: 100%;
  height: 100%;
  border: 1px dotted #fccc6e;
}
.toast-picture {
  position: absolute;
  top: -6.5rem;
  left: -1.5rem;
  width: 18.75rem;
  height: 8.5625rem;
}
.toast-pictrue-change {
  position: absolute;
  top: -1.5rem;
  left: -1.375rem;
  width: 17.5rem;
  height: 3.125rem;
}
.toast-title {
  padding: 2.8125rem 0;
  font-size: 18px;
  color: #fc7939;
  text-align: center;
}
.toast-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.9375rem;
}
.toast-btn div {
  background-image: -moz-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );

  background-image: -ms-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  background-image: -webkit-linear-gradient(
    -18deg,
    rgb(242, 148, 85) 0%,
    rgb(252, 124, 88) 51%,
    rgb(252, 124, 88) 99%
  );
  box-shadow: 0px 4px 0px 0px rgba(174, 34, 5, 0.7);
  width: 4.6875rem;
  height: 1.875rem;
  border-radius: 1.875rem;
  text-align: center;
  line-height: 1.875rem;
  color: #fff;
}
.close {
  position: absolute;
  top: -0.9375rem;
  right: -0.9375rem;
  width: 2rem;
  height: 2rem;
  background: url("../../assets/img/close_store.png") no-repeat center top;
  background-size: 100%;
}
</style>