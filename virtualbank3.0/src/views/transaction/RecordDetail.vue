<template>
  <div class="header">
    <Navigation :title="title" />
  </div>
  <div class="body">
    <div class="window">
      <div class="money">{{ record.money }} 元</div>
      <div class="tag">
        <span>{{ record.type }}</span>
        <span>{{ record.description }}</span>
      </div>
    </div>
    <div class="divider"></div>
    <!-- <van-row>
      <van-col span="7" offset="2">交易对象</van-col>
      <van-col span="10" offset="2">{{ record.name }}</van-col>
    </van-row>
    <div class="divider"></div> -->
    <van-row>
      <van-col span="7" offset="2">交易手续费</van-col>
      <van-col span="10" offset="2">{{ record.gas }} 元</van-col>
    </van-row>
    <div class="divider"></div>
    <van-row>
      <van-col span="7" offset="2">交易时间</van-col>
      <van-col span="10" offset="2">{{ record.date }}</van-col>
    </van-row>
    <div class="divider"></div>
    <van-row>
      <van-col span="7" offset="2">交易流水号</van-col>
      <van-col span="10" offset="2">{{ record.transferId }}</van-col>
    </van-row>
    <div class="divider"></div>
    <van-row>
      <van-col span="7" offset="2">交易卡号</van-col>
      <van-col span="10" offset="2">{{ record.cardId }}</van-col>
    </van-row>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { useRoute } from 'vue-router'
  import Navigation from '@/components/Navigation.vue'

  const route: any = useRoute()
  //   const record = reactive({
  //     name: 'xxl',
  //     money: '20000.00',
  //     gas: '0',
  //     date: '2022-04-15 00:00:35',
  //     type: '充值',
  //     description: '交易成功',
  //     transferId: '2022041500000125',
  //     cardId: '6274433663621989999',
  //   })
  const title = ref('交易明细')
  const record = JSON.parse(route.query.record)
</script>

<style lang="less" scoped>
  .header {
    overflow: hidden;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 50px;
  }
  .body {
    padding-left: 5px;
    padding-right: 5px;
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: whitesmoke;
    .window {
      height: 150px;
      margin-top: 20px;
      background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
      .money {
        font-size: 30px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 100px;
        color: red;
        font-weight: 900;
      }
      .tag {
        display: flex;
        align-items: center;
        justify-content: space-around;
        span {
          color: #0ab388;
          font-weight: 500;
        }
      }
    }
    .divider {
      height: 45px;
    }
  }
</style>
