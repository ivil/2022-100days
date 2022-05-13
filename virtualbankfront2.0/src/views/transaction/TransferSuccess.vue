<template>
  <div class="TransferSuccess">
    <acc-navigation2 :title="title" />

    <div class="box">
      <lottie
        :options="defaultOptions"
        :height="200"
        :width="300"
        v-on:animCreated="handleAnimation"
      />
      <h5>{{ msg }}</h5>
    </div>
    <div class="list">
      <p @click="finish">完成</p>
      <p @click="code">交易记录</p>
    </div>
  </div>
</template>

<script>
import * as animationData from "../../assets/jsonLogo/success1.json";
import AccNavigation2 from "../../components/AccNavigation2.vue";
export default {
  name: "TransferSuccess",
  components: {
    AccNavigation2,
  },
  data() {
    return {
      title: "交易成功",
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 1,
      anim: {},
      msg: "转账成功",
    };
  },
  methods: {
    handleAnimation: function (anim) {
      this.anim = anim;
      console.log(anim); //这里可以看到 lottie 对象的全部属性
    },

    finish() {
      this.$router.replace({ name: "Index" });
    },
    code() {
      this.$router.replace({ path:'/deal/record' });
    },
  },
  created() {
    this.msg = this.$route.query.msg;
  },
};
</script>

<style lang="less" scoped>
@box-shadow: 0px 6px 12px #999;
@border-bottom: 1px solid #999;

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.TransferSuccess {
  //   background: #f2f2f2;
  height: 100%;
  width: 100%;
  position: fixed;
}

.title {
  width: 100%;
  height: 70px;
  margin: 0 auto;
  box-shadow: @box-shadow;
  background: #fff;
  .flex();
  p {
    font-size: 22px;
  }
}

.box {
  width: 350px;
  height: 300px;
  margin: 30px auto;
  h5 {
    width: 350px;
    font-size: 22px;
    margin-top: 30px;
  }
}

.list {
  width: 350px;
  height: 60px;
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
  p {
    width: 140px;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    letter-spacing: 3px;
    border: 2px solid #5684ff;
    border-radius: 5px;
    color: #5684ff;
    &:nth-child(2) {
      background: #5684ff;
      color: #fff;
    }
  }
}
</style>