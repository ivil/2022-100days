<template>
  <van-nav-bar title="兑换记录" left-text="返回" left-arrow @click-left="onClickLeft" />
  <div class="box">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      style="width: 95%"
    >
      <div class="fundlist" v-for="item in list" :key="item">
        <div style="width: 95%; margin: 10px 0 0 10px">{{ item.type }}</div>
        <div style="width: 20%; height: 50px; margin: 10px 0 10px 10px">
          <img src="../../assets/sky.png" style="width: 100%; height: 100%" />
        </div>
        <div style="width: 55%; height: 50px; margin: 10px 0 10px 10px">
          <span style="color: orange">价格：{{ item.money }}积分</span>
          <br />
          <div style="margin-top: 7px">
            <span style="font-size: small">时间：{{ item.time }} 兑换</span>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { goodRecord } from '@/axios/business/goods.api'

  const router = useRouter()
  function onClickLeft() {
    router.go(-1)
  }

  const list: any = ref([])
  const j = ref(7)
  const loading = ref(false)
  const finished = ref(false)
  const valuelist: any = ref([])
  goodRecord().then((value: any) => {
    // console.log(value)
    // for (let i = 0; i < value.length; i++) {
    //   valuelist[i].value = value[i]
    // }
    list.value = value
    console.log('放入列表数据', list)
  })

  const onLoad = () => {
    // 异步更新数据
    // setTimeout 仅做示例，真实场景中一般为 ajax 请求
    setTimeout(() => {
      // for (let i = 0; i < 2; i++) {
      //   valuelist.value.push(list.value[j.value])
      //   j.value += j.value
      // }
      // 加载状态结束
      loading.value = false

      // 数据全部加载完成
      // if (valuelist.value.length >= list.value.length) {
      //   finished.value = true
      // }
      finished.value = true
    }, 1000)
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
