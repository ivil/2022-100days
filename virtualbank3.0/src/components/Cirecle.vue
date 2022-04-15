<template>
  <div id="myChart" style="width: 100%; height: 198px; margin-bottom: 40px; margin-right: 25px"></div>
</template>

<script lang="ts" setup>
  import * as echarts from 'echarts'
  import { nextTick, onMounted, reactive, ref } from 'vue'
  import { contain } from 'echarts/types/src/scale/helper'
  import { useStore } from 'vuex'
  import { allMoney } from '@/axios/business/finance.api'

  const store = useStore()
  const money = reactive({
    assetStructureList: [] as any[],
  })

  allMoney().then((value: any) => {
    console.log('总资产分布', value)
    // console.log(data.stocksList)
    money.assetStructureList = value.assetStructureList
    store.commit('getname', money.assetStructureList[0].name)
    store.commit('getname2', money.assetStructureList[1].name)
    store.commit('getmoney', money.assetStructureList[0].assets)
    store.commit('getmoney2', money.assetStructureList[1].assets)
    store.commit('getAssets', money.assetStructureList[1].assets)
    // store.commit('getmoney', money.assetStructureList[0].assets)
    // console.log('vuex', store.state.name1)
    // console.log('vuex', store.state.money1)
    // console.log('vuex', store.state.name2)
    // console.log('vuex', store.state.money2)
    // licai.value = money.assetStructureList[0].type
  })
  const myprofit = reactive({
    option: [
      { value: store.state.money1, name: store.state.name1 },
      { value: store.state.money2, name: store.state.name2 },
    ],
    option2: [store.state.name1, store.state.name2],
  })
  // console.log('测试', licai.value)
  // const mydata = reactive({
  //   name1: money.assetStructureList[0].type,
  //   name2: money.assetStructureList[1].type,
  //   assets1: money.assetStructureList[0].assets,
  //   assets2: money.assetStructureList[1].assets,
  // })
  const echartInit = () => {
    const myChart = echarts.init(document.getElementById('myChart'))
    myChart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: -5,
        align: 'right',
        // data: [mydata.name1, mydata.name2],
        data: myprofit.option2,
        padding: [42, 6, 7, 6],
      },
      grid: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: true,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '30',
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: myprofit.option,
        },
      ],
    })
  }

  nextTick(() => {
    echartInit()
  })
  // 挂载
  // onMounted(() => {
  //   nextTick(() => {
  // echartInit()
  //   })
  // })
</script>

<style scoped></style>
