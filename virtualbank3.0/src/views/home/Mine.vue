<template>
  <div class="box">
    <div class="top">
      <div class="touxiang">
        <van-image round width="5rem" height="5rem" src="https://cdn.jsdelivr.net/npm/@vant/assets/cat.jpeg" />
      </div>
      <div style="margin: 31px 0 0 20px; width: 50%; display: flex">
        <p style="color: white" v-if="money.mytoken">已登录</p>
        <p style="color: white" @click="tologin" v-else>未登录/注册</p>
        <p style="color: white; margin-left: 10px" @click="toSettings">设置</p>
      </div>
      <div class="sortcard">
        <div style="text-align: center" @click="toBindCard">
          <p>银行卡</p>
          <p>1</p>
        </div>
        <div style="text-align: center">
          <p>积分</p>
          <p>1</p>
        </div>
        <div style="text-align: center">
          <p>待办</p>
          <p>1</p>
        </div>
        <div style="text-align: center">
          <p>消息</p>
          <p>1</p>
        </div>
      </div>
    </div>
    <div class="balance">
      <div style="width: 90%; height: 25px; text-align: center; margin-top: 10px">
        <span>总资产(元)</span>
      </div>
      <div style="width: 90%; height: 25px; margin-top: 10px; text-align: center">
        <span style="font-size: 30px; color: orange">{{ data.allmoney }}</span>
      </div>
      <div
        style="
          width: 100%;
          height: 89%;
          display: flex;
          align-items: center;
          margin-left: 33px;
          margin-bottom: 30px;
          padding: 0;
        "
      >
        <cirecle></cirecle>
      </div>
    </div>
    <!--    <div class="power">-->
    <div class="addcard" style="background-color: white; margin-right: 10px">
      <div class="addfont" @click="toWithdraw" style="color: black">提现</div>
    </div>
    <div class="addcard">
      <div class="addfont" @click="toRecharge">充值</div>
      <!--      </div>-->
    </div>
    <div class="more">
      <div style="width: 95%; height: 25px; margin: 20px 0 10px 20px"><span>权益服务</span></div>
      <div
        style="
          width: 90%;
          height: 70px;
          margin: 0 auto;
          background-color: #b3d4fc;
          border-radius: 10px;
          overflow: hidden;
        "
      >
        <img src="../../assets/quanyi.png" style="width: 100%; height: 100%" />
      </div>
    </div>
    <div
      style="
        position: absolute;
        top: 640px;
        width: 100%;
        height: 100px;
        background-color: rgb(245, 245, 245);
        margin-top: 10px;
      "
    ></div>
    <van-divider style="position: absolute; top: 650px; width: 95%; height: 20px">已经到底啦</van-divider>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'
  import { log } from 'echarts/types/src/util/log'
  import Cirecle from '@/components/Cirecle.vue'
  import { allMoney } from '@/axios/business/finance.api'

  export default defineComponent({
    name: 'MySelf',
    components: { Cirecle },
    setup() {
      const router = useRouter()
      // 跳转登录
      function tologin() {
        router.push('/loginByPhone')
      }
      function toBindCard() {
        router.push('/bindCard')
      }
      function toSettings() {
        router.push('/settings')
      }
      const toWithdraw = ()=>{
        router.push('/transaction/withdraw')
      }
      const toRecharge = ()=>{
        router.push('/transaction/recharge')
      }
      const data = reactive({
        allmoney: '',
      })
      const money = reactive({
        assetStructureList: [] as any[],
        mytoken: '' as any,
      })

      money.mytoken = sessionStorage.getItem('token')

      const store = useStore()
      console.log('token是', store.state.token)
      allMoney().then((value: any) => {
        // console.log('总资产分布', value)
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
      return {
        tologin,
        toBindCard,
        toSettings,
        data,
        store,
        money,
        toWithdraw,
        toRecharge
      }
    },
  })
</script>

<style scoped lang="less">
  .box {
    //position: absolute;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 100vw;
    min-height: 110vh;
    background: rgb(245, 245, 245);

    .top {
      position: absolute;
      width: 100%;
      height: 250px;
      background: linear-gradient(90deg, rgba(85, 158, 223, 1) 0%, rgba(105, 185, 227, 1) 100%);
      border-radius: 0 0 30px 30px;
      display: flex;
      flex-wrap: wrap;
      .touxiang {
        margin: 20px 0 0 20px;
      }
      .sortcard {
        display: flex;
        justify-content: space-around;
        margin-bottom: 30%;
        width: 100%;
        color: white;
      }
    }
    .balance {
      position: absolute;
      top: 190px;
      width: 95%;
      height: 260px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-content: flex-start;
      background: white;
      border-radius: 20px;
    }
    //.power {
    //  position: relative;
    //  top: 430px;
    //  width: 95%;
    //  height: 70px;
    //  background: white;
    //  display: flex;
    //  justify-content: space-around;
    //  border-radius: 20px;
    .addcard {
      position: relative;
      top: 430px;
      width: 40%;
      height: 50px;
      margin-top: 10px;
      background-color: #198cff;
      border-radius: 5px;
      border: 1px solid rgb(99, 137, 251);
      display: flex;
      justify-content: center;
      align-items: center;
      .addfont {
        color: white;
      }
    }
    //}
    .more {
      position: absolute;
      top: 505px;
      width: 95%;
      height: 140px;
      background: white;
      border-radius: 20px;
    }
  }
</style>
