<template>
  <div class="box">
    <div class="top">
      <TheWeather class="weather" />
      <div style="width: 50%; height: 50px">
        <div
          style="
            width: 40px;
            height: 50px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            float: right;
            margin-top: 8px;
          "
        >
          <van-icon name="service-o" color="white" size="20" /><span
            style="font-size: small; color: white; margin-bottom: 7px"
            >帮助</span
          >
        </div>
      </div>
      <div style="width: 95%; height: 110px; margin: 10px 0 0 10px">
        <img src="../../assets/bird2.png " style="width: 100%; height: 100%" />
      </div>
    </div>
    <div class="content">
      <div class="fundnav">
        <div
          style="display: flex; flex-wrap: wrap; width: 25%; justify-content: center; margin-top: 20px"
          v-for="(item, index) in navdata"
          :key="index"
        >
          <div style="width: 90%; display: flex; justify-content: center">
            <router-link :to="item.url">
              <!--              <i :class="item.iconclass" style="font-size: 30px; color: #198cff"></i>-->
              <img :src="item.img" style="width: 30px; height: 30px" />
            </router-link>
          </div>

          <div style="width: 90%; display: flex; justify-content: center; font-size: 15px">
            <router-link :to="item.url">
              <span style="color: black">{{ item.navname }}</span>
            </router-link>
          </div>
        </div>
        <div style="height: 20px; width: 100%"></div>
      </div>
      <div class="lunbo">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" width="390" height="99">
          <van-swipe-item><img src="../../assets/lunbo1.png" style="width: 100%; height: 100%" /></van-swipe-item>
          <van-swipe-item><img src="../../assets/lunbo2.png" style="width: 100%; height: 100%" /></van-swipe-item>
          <van-swipe-item><img src="../../assets/lunbo3.png" style="width: 100%; height: 100%" /></van-swipe-item>
        </van-swipe>
      </div>
      <div class="activity">
        <div style="width: 95%; height: 25px; margin: 20px 0 10px 20px"><span>颐享阳光</span></div>
        <div
          style="
            width: 90%;
            height: 120px;
            margin: 0 auto;
            background-color: #b3d4fc;
            border-radius: 10px;
            overflow: hidden;
          "
        >
          <img src="../../assets/sun.png" style="width: 100%; height: 100%" />
        </div>
      </div>
      <div style="width: 90%; height: 70px"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import TheWeather from '@/components/TheWeather.vue'
  import '@/assets/icon/fund1test/iconfont.css'
  import { useStore } from 'vuex'
  import { allMoney } from '@/axios/business/finance.api'

  const router = useRouter()
  const navdata = reactive([
    {
      navname: '充值',
      url: '/transaction/recharge',
      img: require('../../assets/recharge.png'),
    },
    {
      navname: '提现',
      url: '/transaction/withdraw',
      img: require('../../assets/recharge.png'),
    },
    {
      navname: '开户',
      url: '/openAccount',
      img: require('../../assets/openaccount.png'),
    },
    {
      navname: '绑卡',
      url: '/bindCard',
      img: require('../../assets/bindcard.png'),
    },
    {
      navname: '交易记录',
      url: '/transaction/tradingRecords',
      img: require('../../assets/traderecord.png'),
    },
    {
      navname: '转账',
      url: '/transaction/transfer',
      img: require('../../assets/zhuanzhang.png'),
    },
    {
      navname: '余额',
      url: '/transaction/balance',
      img: require('../../assets/lastmoney.png'),
    },
    {
      navname: '全部',
      url: '#',
      img: require('../../assets/allapp.png'),
    },
  ])

  const data = reactive({
    allmoney: '',
  })
  const money = reactive({
    assetStructureList: [] as any[],
  })

  const store = useStore()
  if (sessionStorage.getItem('token')) {
    allMoney().then((value: any) => {
      // console.log('home总资产分布', value)
      // console.log(data.stocksList)
      data.allmoney = value.assetStructureList[1].assets
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
      position: absolute;
      width: 100%;
      height: 250px;
      background: linear-gradient(90deg, rgba(85, 158, 223, 1) 0%, rgba(105, 185, 227, 1) 100%);
      border-radius: 0 0 30px 30px;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
    }
    .content {
      width: 100%;
      min-height: 465px;
      background-color: rgb(245, 245, 245);
      margin-top: 200px;
      border-radius: 10px 10px 0 0;
      z-index: 20;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      justify-content: center;
      .fundnav {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        width: 95%;
        height: 160px;
        background-color: rgb(245, 245, 245);
        border-radius: 8px;
        margin: 0 auto;
        margin-top: 10px;
      }
      .lunbo {
        width: 95%;
        height: 90px;
        margin-top: 10px;
        background-color: rgb(245, 245, 245);
        border-radius: 10px;
        overflow: hidden;
        .my-swipe .van-swipe-item {
          color: rgb(245, 245, 245);
          font-size: 20px;
          line-height: 90px;
          text-align: center;
          background-color: rgb(245, 245, 245);
        }
      }
      .activity {
        width: 95%;
        height: 200px;
        background-color: white;
        margin-top: 10px;
        border-radius: 10px;
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
      }
    }
  }
</style>
