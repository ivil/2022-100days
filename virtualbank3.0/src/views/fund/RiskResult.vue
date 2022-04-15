<template>
  <van-nav-bar title="评估结果" left-text="返回" left-arrow @click-left="onClickLeft" />
  <div class="box">
    <div class="result">
      <div style="text-align: center; margin-top: 15px; width: 100%"><span>您的风险承受能力等级为</span></div>
      <div style="width: 30%; height: 120px; margin-left: 10px; margin-top: 10px">
        <div class="box1"></div>
        <div class="box2">
          <span style="color: white">{{ store.state.riskLevel }}</span>
        </div>
        <div class="box3"></div>
      </div>
      <div style="width: 100%; height: 10px"></div>
    </div>

    <div class="addcard">
      <div class="addfont" @click="toIndex">完成</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'

  const router = useRouter()
  function onClickLeft() {
    router.push('/FundIndex')
  }
  function toIndex() {
    router.push('/FundIndex')
  }
  const store = useStore()
</script>

<style scoped lang="less">
  .box {
    width: 100vw;
    min-height: 95vh;
    background-color: rgb(245, 245, 245);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    .result {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 10px;
      background-color: white;
    }
    .addcard {
      width: 95%;
      height: 50px;
      margin-top: 10px;
      background-color: #198cff;
      border-radius: 5px;
      border: 1px solid #198cff;
      display: flex;
      justify-content: center;
      align-items: center;

      .addfont {
        color: white;
      }
    }
    .box1 {
      width: 0;
      border-left: 52px solid transparent;
      border-right: 52px solid transparent;
      border-bottom: 30px solid #6c6;
    }
    .box2 {
      width: 104px;
      height: 60px;
      text-align: center;
      line-height: 50px;
      background-color: #6c6;
    }
    .box3 {
      width: 0;
      border-top: 30px solid #6c6;
      border-left: 52px solid transparent;
      border-right: 52px solid transparent;
    }
  }
</style>
