<template>
  <ul>
    <li @click="goBack">
      <i class="el-icon-arrow-left"></i>
    </li>
    <li>
      <h3>{{ title }}</h3>
    </li>
    <li>
      <!-- <i class="iconfont">&#xe618;</i> -->
      <lottie :options="defaultOptions" :height="50" :width="50" v-on:animCreated="handleAnimation" />
    </li>
  </ul>
</template>

<script>
import * as animationData from "../assets/jsonLogo/logo9.json";

export default {
  name: "DealNav",
  data() {
    return {
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 1,
      anim: {},
    };
  },
  props: {
    title: {
      default: "欢迎",
      type: String,
    },
  },
  methods: {
    handleAnimation: function (anim) {
      this.anim = anim;
    //   console.log(anim); //这里可以看到 lottie 对象的全部属性
    },
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 100vw;
  margin-bottom: 10px;
  background-size: 100% 100%;
  box-shadow: 0px 5px 10px #ddd;

  li {
    font-size: 20px;
    &:first-child{
      width: 50px;
    }
    &:last-child{
      width: 50px;
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
</style>