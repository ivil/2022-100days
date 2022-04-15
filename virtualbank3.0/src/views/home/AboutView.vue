<template>
  <div class="box">
    <div class="top">
      <div class="title">
        <span style="font-size: 40px">积分乐园</span><br /><span style="font-size: medium; margin-top: 10px"
          >每天快乐少一点</span
        >
      </div>
      <div style="width: 46%; display: flex; justify-content: center">
        <img src="../../assets/mypoint.png" style="width: 90%; height: 150px" />
      </div>
    </div>
    <div class="content">
      <div class="point">
        <div style="width: 20%; display: flex; justify-content: center; align-items: center"><span>积分</span></div>
        <div class="verticalBar"></div>
        <div style="width: 40%; display: flex; align-items: center; color: orange; font-size: 30px; margin-left: 20px">
          <span>{{ mydata.mypoint }}</span>
        </div>
        <div style="width: 26%; display: flex; align-items: center">
          <van-tag round type="warning" style="width: 100%; height: 35%" @click="torecord">查看兑换记录</van-tag>
        </div>
      </div>
      <div class="goods" v-for="item in mydata.goodlist" :key="item">
        <div style="width: 95%; height: 70px; margin-top: 10px">
          <img src="../../assets/sky.png" style="width: 100%; height: 100%" />
        </div>
        <div style="margin-top: 10px">
          <span>{{ item.name }}</span>
        </div>
        <div style="width: 100%; display: flex; justify-content: space-around; margin-top: 10px">
          <span style="color: orange">{{ item.money }}积分</span>
          <van-tag round type="warning" size="medium" @click="exchange(item)">兑换</van-tag>
        </div>
        <div style="width: 90%; height: 10px"></div>
      </div>
      <div style="width: 90%; height: 70px"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Dialog, Toast } from 'vant'
  import allGoods, { buyGood, myPoint } from '@/axios/business/goods.api'

  const mydata = reactive({
    goodlist: [],
    mypoint: '',
  })
  allGoods().then((value: any) => {
    console.log('积分商品', value)
    mydata.goodlist = value
  })

  myPoint().then((value: any) => {
    console.log('我的积分', value)
    mydata.mypoint = value
  })

  const router = useRouter()
  function torecord() {
    router.push('/PointRecord')
  }
  function exchange(item) {
    Dialog.confirm({
      title: '兑换',
      message: '您确定兑换吗',
    })
      .then(() => {
        // on confirm
        const data = {
          productId: item.id,
          integralGoodsName: item.name,
          integralChange: item.money,
          number: '1',
        }
        console.log(data)
        buyGood(data).then((value) => {
          console.log(value)
          if (value === '无') {
            Toast.success('兑换成功')
            myPoint().then((value: any) => {
              // console.log('我的积分', value)
              mydata.mypoint = value
            })
          }
        })
      })
      .catch(() => {
        // on cancel
      })
  }
</script>

<style scoped lang="less">
  .box {
    width: 100vw;
    min-height: 100vh;
    background-color: rgb(245, 245, 245);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    .top {
      position: fixed;
      width: 100%;
      height: 200px;
      background: linear-gradient(90deg, rgba(85, 158, 223, 1) 0%, rgba(105, 185, 227, 1) 100%);
      border-radius: 0 0 30px 30px;
      display: flex;
      flex-wrap: wrap;
      .title {
        width: 50%;
        display: flex;
        flex-wrap: wrap;
        color: white;
        margin: 30px 0 0 10px;
        overflow: hidden;
        align-content: flex-start;
      }
    }
    .content {
      position: absolute;
      width: 100%;
      min-height: 600px;
      background-color: rgb(245, 245, 245);
      border-radius: 15px 15px 0 0;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: flex-start;
      top: 150px;
      .point {
        width: 85%;
        height: 70px;
        margin: 0 auto;
        margin-top: 20px;
        border-radius: 10px;
        display: flex;
        background-color: white;
        .verticalBar {
          width: 2px;
          height: 45px;
          background: gainsboro;
          display: inline-block;
          margin-top: 12px;
        }
      }
      .goods {
        width: 46%;
        border-radius: 10px;
        background-color: white;
        margin-top: 10px;
        margin-left: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  }
</style>
