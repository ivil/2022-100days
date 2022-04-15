<template>
  <TransactionNav :title="title" />
  <div class="body">
    <van-calendar
      color="#198CFF"
      allow-same-day
      :show="showCalender"
      type="range"
      @confirm="onConfirm"
      @click-close-icon="showCalender = false"
      :min-date="new Date(2018, 8, 28)"
      :max-date="new Date()"
      :show-title="false"
    />
    <van-tabs v-model:active="active" animated swipeable color="blue" sticky offset-top="49.9px">
      <van-tab>
        <template #title>
          <img @click="showCalender = true" class="calender" src="../../assets/transaction/date.png" />
        </template>
        <div class="transferRecords">
          <template v-for="(item, index) in timeRecords" :key="index">
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
                  ><span style="color: orange">{{ item.gas }} 元</span></van-col
                >
              </van-row>
            </van-cell>
          </template>
        </div>
        <template v-if="timeRecords.length === 0">
          <van-empty description="最近没有交易哟" />
        </template>
      </van-tab>
      <van-tab title="转账">
        <template #title>
          <van-button class="tabNav" plain type="primary">转账</van-button>
        </template>
        <div class="transferRecords">
          <template v-for="(item, index) in records" :key="index">
            <van-cell class="record" clickable v-if="item.type === '转账'" @click="toDetail(item)">
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
                  ><span style="color: orange">{{ item.gas }} 元</span></van-col
                >
              </van-row>
            </van-cell>
          </template>
        </div>
        <template v-if="records.length === 0">
          <van-empty description="最近没有交易哟" />
        </template>
      </van-tab>
      <van-tab title="充值">
        <template #title>
          <van-button class="tabNav" plain type="primary">充值</van-button>
        </template>
        <!-- <van-empty description="最近没有交易哟" /> -->
        <div class="transferRecords">
          <template v-for="(item, index) in records" :key="index">
            <van-cell class="record" clickable v-if="item.type === '充值'" @click="toDetail(item)">
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
                  ><span style="color: orange">{{ item.gas }} 元</span></van-col
                >
              </van-row>
            </van-cell>
          </template>
        </div>
        <template v-if="records.length === 0">
          <van-empty description="最近没有交易哟" />
        </template>
      </van-tab>
      <van-tab title="提现">
        <template #title>
          <van-button class="tabNav" plain type="primary">提现</van-button>
        </template>
        <!-- <van-empty description="最近没有交易哟" /> -->
        <div class="transferRecords">
          <template v-for="(item, index) in records" :key="index">
            <van-cell class="record" clickable v-if="item.type === '提现'" @click="toDetail(item)">
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
                  ><span style="color: orange">{{ item.gas }} 元</span></van-col
                >
              </van-row>
            </van-cell>
          </template>
        </div>
        <template v-if="records.length === 0">
          <van-empty description="最近没有交易哟" />
        </template>
      </van-tab>
    </van-tabs>
  </div>
  <div class="footer"></div>
</template>

<script lang="ts" setup>
  import { ref } from '@vue/reactivity'
  import { Dialog, Toast } from 'vant'
  import TransactionNav from '@/components/TransactionNav.vue'
  import { tradingRecords, queryByTime } from '@/axios/business/transaction.api'
  import router from '@/router/index'

  const title = ref('交易记录')
  const active = ref(0)
  // 全部记录
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
  // 获取交易记录
  tradingRecords().then((value: any) => {
    records.value = []
    if (value) {
      records.value = value
    }
  })
  // 按时间查的交易记录
  const timeRecords: any = ref([
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

  // 前往详情页
  const toDetail = (item: any) => {
    router.push({
      path: '/transaction/recordDetail',
      query: {
        record: JSON.stringify(item),
      },
    })
  }
  // 是否显示日期
  const showCalender = ref(false)
  // 日期格式化函数
  const formatter = (date: Date) => {
    const temp = date.toLocaleString().split(' ')[0].split('/')
    if (temp[1].length === 1) {
      temp[1] = `0${temp[1]}`
    }
    if (temp[2].length === 1) {
      temp[2] = `0${temp[2]}`
    }
    return `${temp[0]}-${temp[1]}-${temp[2]}`
  }
  // 确认日期
  const onConfirm = (values: [Date, Date]) => {
    const [start, end] = values
    // console.log(formatter(start))
    // console.log(formatter(end))
    // 加载动画
    const loading = Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'circular',
      duration: 0,
      overlay: true,
    })
    queryByTime(formatter(start), formatter(end)).then((value: any) => {
      timeRecords.value = []
      if (value) {
        timeRecords.value = value
      }
    })
    loading.close()
    showCalender.value = false
  }
</script>

<style lang="less" scoped>
  // 增加间距
  .divider {
    height: 10px;
  }
  .body {
    position: fixed;
    top: 50px;
    left: 0;
    right: 0;
    bottom: 0px;
    overflow-y: auto;
    background-color: whitesmoke;
    .calender {
      width: 25px;
      height: 25px;
    }
    .tabNav {
      height: 30px;
      border: none;
    }
    .transferRecords {
      .record {
        margin: 10px 0;
        background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
      }
    }
  }
</style>
