<template>
  <van-nav-bar title="交易记录" left-text="返回" left-arrow @click-left="onClickLeft" />
  <div class="box">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      style="width: 95%"
    >
      <div class="fundlist" v-for="item in list" :key="item">
        <div style="width: 40%; margin: 5px 0 0 10px">{{ item.name }}</div>
        <div style="width: 50%; margin: 5px 0 0 10px">
          <van-tag
            plain
            round
            size="medium"
            type="primary"
            color="#198cff"
            text-color="#198cff"
            style="margin-left: 10px; margin-top: 3px"
            >股票型</van-tag
          >
          <van-tag round size="medium" color="#ffe1e1" text-color="#ad0000" style="margin-left: 10px; margin-top: 3px"
            >手续费：{{ item.spare1 }}{{ item.spare2 }}元</van-tag
          >
        </div>
        <div style="width: 44%; height: 50px; margin: 10px 0 10px 10px; display: flex; flex-wrap: wrap">
          <span>交易金额：</span><span style="font-size: 25px; color: rgb(218, 90, 43)">{{ item.amount }}元</span>
          <br />
          <!--          <span style="font-size: small">近七日年化率</span>-->
        </div>
        <div style="width: 46%; height: 50px; margin: 10px 0 10px 10px">
          <span style="font-size: small">交易状态:{{ item.tradeType }}</span>
          <div style="margin-top: 7px">
            <span style="font-size: small">交易时间: {{ item.effectTime }}</span>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { CurrencyDetail, queryFund, SharesDetail, fundRecord } from '@/axios/business/finance.api'

  const router = useRouter()
  function onClickLeft() {
    router.go(-1)
  }

  const list: any = ref([])
  const loading = ref(false)
  const finished = ref(false)

  const valuelist: any = ref([])
  const store = useStore()

  const onLoad = () => {
    // 异步更新数据
    // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    // setTimeout(() => {
    //   for (let i = 0; i < 2; i++) {
    //     valuelist.value.push(list.value[j.value])
    //     j.value += j.value
    //   }
    //   // 加载状态结束
    //   loading.value = false
    //
    //   // 数据全部加载完成
    //   if (valuelist.value.length >= list.value.length) {
    //     finished.value = true
    //   }
    // }, 1000)
    loading.value = false
    finished.value = true
  }
  fundRecord().then((value) => {
    console.log(value)
    list.value = value
  })
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
    .fundlist {
      width: 100%;
      height: 100px;
      display: flex;
      flex-wrap: wrap;
      background-color: white;
      border-radius: 10px;
      margin: 0 auto;
      margin-top: 10px;
      box-shadow: 3px 3px 3px gainsboro;
    }
  }
</style>
