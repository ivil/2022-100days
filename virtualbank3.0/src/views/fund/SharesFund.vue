<template>
  <van-nav-bar title="股票型型基金" left-text="返回" left-arrow @click-left="onClickLeft" />
  <div class="box">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      style="width: 95%"
    >
      <div class="fundlist" v-for="item in shareslist.list" :key="item" @click="todetail(item)">
        <div style="width: 95%; margin: 10px 0 0 10px">{{ item.name }}</div>
        <div style="width: 40%; height: 50px; margin: 10px 0 10px 10px">
          <span style="font-size: 25px; color: rgb(218, 90, 43)">{{ item.todayIncrease }}%</span>
          <br />
          <span style="font-size: small">近七日年化率</span>
        </div>
        <div style="width: 51%; height: 50px; margin: 10px 0 10px 10px">
          <span style="">{{ item.introduce }}</span>
          <br />
          <div style="margin-top: 7px">
            <span style="font-size: small">代销 | {{ item.minimum }}元起 | 较低风险</span>
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
  import { queryFund, SharesDetail } from '@/axios/business/finance.api'

  const router = useRouter()
  function onClickLeft() {
    router.go(-1)
  }

  const list: any = ref([])
  const loading = ref(false)
  const finished = ref(false)
  const j = ref(7)
  const valuelist: any = ref([])
  const shareslist = reactive({
    list: [],
  })
  queryFund('02').then((value: any) => {
    console.log('按条件查询', value)
    // for (let i = 0; i < 7; i++) {
    //   valuelist[i].value = value[i]
    // }
    shareslist.list = value
    console.log(shareslist.list)
    // data.fundall = value
  })

  const onLoad = () => {
    // 异步更新数据
    // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    // setTimeout(() => {
    //   // for (let i = 0; i < 2; i++) {
    //   //   valuelist.value.push(list.value[j.value])
    //   //   j.value += j.value
    //   // }
    //
    //   // 加载状态结束
    //   loading.value = false
    //
    //   // 数据全部加载完成
    //   // if (valuelist.value.length >= list.value.length) {
    //   //
    //   // }
    //   finished.value = true
    // }, 1000)
    loading.value = false
    finished.value = true
  }

  const store = useStore()

  function todetail(fund: any) {
    // 股票基金详情
    // console.log(fund.id)
    SharesDetail(fund.id).then((value: any) => {
      // console.log('gupiao基金详情', value)
      // console.log(value.Fund)
      console.log('xinagq', value.rate)
      store.commit('getRate', value.rate)
      store.commit('getFund', value.Fund)
      router.push('/FundDetail')
    })
  }
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
