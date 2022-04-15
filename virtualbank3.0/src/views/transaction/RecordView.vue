<template>
  <div class="header">
    <Navigation :title="title" />
  </div>
  <div class="body">
    <div class="transferRecords">
      <template v-for="(item, index) in records" :key="index">
        <van-cell class="record" clickable @click="toDetail(item)">
          <van-row align="center" justify="space-between">
            <van-col :span="13"
              ><span style="font-weight: 900">{{ item.description }}</span></van-col
            >
            <van-col :span="11"
              ><van-tag plain type="danger" size="medium">{{ item.type }}</van-tag
              ><span style="margin-left: 10px; color: red">{{ item.money }} 元</span></van-col
            >
          </van-row>
          <div class="divider"></div>
          <van-row align="center" justify="space-between">
            <van-col :span="13"
              ><span style="color: green">{{ item.date }}</span></van-col
            >
            <van-col :span="11"
              ><span style="color: orange">手续费：</span
              ><span style="margin-left: 10px; color: orange">{{ item.gas }} 元</span></van-col
            >
          </van-row>
        </van-cell>
      </template>
      <template v-if="records.length === 0">
        <van-empty description="最近没有交易哟" />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { Toast, Dialog } from 'vant'
  import { useRoute } from 'vue-router'
  import { json } from 'stream/consumers'
  import Navigation from '@/components/Navigation.vue'
  import { queryByCard } from '@/axios/business/transaction.api'
  import router from '@/router/index'

  const route = useRoute()
  const title = ref('交易明细')

  // 交易记录列表
  const records: any = ref([
    // {
    //   name: null,
    //   money: '20000.00',
    //   gas: '0',
    //   date: '2022-04-15 00:00:35',
    //   type: '充值',
    //   description: '交易成功',
    //   transferId: '2022041500000125',
    //   cardId: '6274433663621989999',
    // },
  ])
  // 加载动画
  const loading = Toast.loading({
    message: '加载中...',
    forbidClick: true,
    loadingType: 'circular',
    duration: 0,
    overlay: true,
  })
  queryByCard(route.query.id).then((value) => {
    // records.value = []
    loading.close()
    if (value) {
      records.value = value
    }
  })
  // 前往详情页
  const toDetail = (item: any) => {
    router.push({
      path: '/transaction/recordDetail',
      query: {
        record: JSON.stringify(item),
      },
    })
  }
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
    background-color: whitesmoke;
    .error {
      font-size: 10px;
      color: orangered;
      text-align: center;
      height: 35px;
    }
    .logo {
      height: 150px;
      background-color: whitesmoke;
      background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcG0ftGm8uGfLpHILQcul9nlf3cFUoLF-IvA&usqp=CAU');
      background-size: 100% 100%;
    }
    .input {
      border: none;
      border-bottom: 1px solid grey;
      padding-left: 10px;
    }
    .button {
      width: 94%;
      margin: auto;
    }
    .protocol {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .login {
      margin-top: 20px;
      color: #198cff;
      float: right;
      padding-right: 20px;
      span {
        border-bottom: 1px solid #198cff;
      }
    }
    .transferRecords {
      .record {
        margin: 10px 0;
        background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
      }
    }
  }
  .newPassword {
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      border: none;
      border-bottom: 1px solid grey;
      font-size: 18px;
      width: 150px;
      height: 40px;
      text-align: center;
    }
  }
</style>
