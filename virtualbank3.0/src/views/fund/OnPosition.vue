<template>
  <van-nav-bar title="产品详情" left-text="返回" left-arrow @click-left="onClickLeft" />
  <div class="box">
    <div class="title">
      <div style="width: 95%; text-align: center; margin-top: 15px">
        <span>{{ store.state.positionFund.showName }}</span>
      </div>
      <div style="width: 95%; text-align: center; margin-top: 10px; margin-right: 9px">
        <van-tag plain round size="medium" type="primary" color="orange" text-color="orange" style="margin-left: 10px"
          >笨鸟理财</van-tag
        >
        <div style="width: 95%; text-align: center; margin-top: 10px">
          <span style="font-size: small; color: #999; margin-left: 23px">持仓市值(元)</span><br />
        </div>
        <div style="width: 95%; text-align: center; margin-top: 10px">
          <span
            style="font-size: 25px; margin-left: 23px; color: orange"
            v-if="store.state.positionFund.showType === '02'"
            >{{ store.state.positionFund.showValue }}</span
          >
          <span
            style="font-size: 25px; margin-left: 23px; color: orange"
            v-if="store.state.positionFund.showType === '01'"
            >{{ store.state.positionFund.showValue }}</span
          >
        </div>
      </div>
      <!--      <div style="width: 45%; text-align: center; margin-top: 10px">-->
      <!--        <span>0</span><br /><span style="color: #999">日盈亏</span>-->
      <!--      </div>-->
      <!--      <div style="width: 45%; text-align: center; margin-top: 10px">-->
      <!--        <span>0</span><br /><span style="color: #999">累计盈亏</span>-->
      <!--      </div>-->
      <div class="tableTitle"></div>
      <div style="width: 45%; margin-top: 10px; font-size: small; color: #999">
        <span>id：</span><span>{{ store.state.positionFund.showId }}</span>
      </div>
      <div style="width: 45%; margin-top: 10px; text-align: right; font-size: small; color: #999">
        <span v-if="store.state.positionFund.showType === '02'">类型：股票型</span>
        <span v-if="store.state.positionFund.showType === '01'">类型：货币型</span>
      </div>
      <!--      <div style="width: 45%; text-align: left; margin-top: 10px; font-size: small; color: #999">-->
      <!--        <span>七日年化</span><span>7.00</span>-->
      <!--      </div>-->
      <!--      <div style="width: 45%; margin-top: 10px; text-align: right"><span></span><span></span></div>-->
      <div style="height: 10px; width: 95%"></div>
    </div>
    <!--    <div class="profit">-->
    <!--      <div id="echartLine" class="echartDiv" style="width: 90%; height: 350px"></div>-->
    <!--    </div>-->
    <div style="width: 95%; height: 80px"></div>
    <div class="bottom" @click="show = true"><div>赎回</div></div>

    <!--赎回遮罩-->
    <van-action-sheet v-model:show="show" title="产品赎回">
      <div class="content">
        <div class="top">
          <van-cell :title="store.state.positionFund.showName" value="可赎回" size="medium" />
        </div>
        <div class="min" v-if="store.state.positionFund.showType === '02'">
          <van-cell title="可用份额" :value="store.state.positionFund.sharesHeld" size="medium" />
          <van-cell title="最低赎回份额" :value="moneydata.leastmoney" size="medium" />
        </div>
        <div class="min" v-if="store.state.positionFund.showType === '01'">
          <van-cell title="可用金额" :value="store.state.positionFund.showValue" size="medium" />
          <van-cell title="最低赎回金额" :value="moneydata.leastmoney" size="medium" />
        </div>
        <div class="money">
          <br />
          <p>赎回份额</p>
          <div class="input" v-if="store.state.positionFund.showType === '02'">
            <img src="../../assets/transaction/peopleMoney.png" />
            <input
              v-model="moneydata.money"
              type="text"
              :placeholder="moneydata.explaininput + moneydata.maxmoney"
              @blur="panduan"
            />
          </div>
          <div class="input" v-if="store.state.positionFund.showType === '01'">
            <img src="../../assets/transaction/peopleMoney.png" />
            <input
              v-model="moneydata.money"
              type="text"
              :placeholder="moneydata.explaininput + moneydata.maxcurrency"
              @blur="panduanCurrency"
            />
          </div>
          <div class="border"></div>
          <div style="width: 100%; display: flex">
            <div style="width: 70%; height: 30px">
              <span style="width: 100%; color: red; font-size: small; margin-left: 20px">{{ moneydata.erroInfo }}</span>
            </div>
            <div
              style="width: 30%; height: 30px; display: flex; justify-content: center; align-items: center"
              v-if="store.state.positionFund.showType === '02'"
            >
              <van-tag
                plain
                round
                size="medium"
                type="primary"
                color="#198cff"
                text-color="#198cff"
                style="margin-left: 10px"
                @click="allredeem"
                >全部赎回</van-tag
              >
            </div>
            <div
              style="width: 30%; height: 30px; display: flex; justify-content: center; align-items: center"
              v-if="store.state.positionFund.showType === '01'"
            >
              <van-tag
                plain
                round
                size="medium"
                type="primary"
                color="#198cff"
                text-color="#198cff"
                style="margin-left: 10px"
                @click="allredeemCurrency"
                >全部赎回</van-tag
              >
            </div>
          </div>
        </div>
        <div style="width: 94%; height: 70px; background-color: white; margin-top: 10px; padding: 10px">
          <span style="color: orange; font-size: small">交易规则:</span>
          <p style="font-size: small">
            输入赎回份额，必须大于最低赎回份额且小于可用份额，<br />
            也可点击“全部赎回”按钮，全部赎回
          </p>
        </div>
        <div style="display: flex; justify-content: center; margin-top: 10px">
          <van-checkbox v-model="moneydata.checked" checked-color="#3398FF" icon-size="15px">
            <span style="margin-top: -0.5rem; font-size: 0.5rem; color: #9f9d9d">
              我已阅读并同意
              <router-link :to="{ path: '/term' }">
                <span style="color: #3398ff">《个人信息查询使用授权书》</span>
              </router-link>
            </span>
          </van-checkbox>
        </div>
        <div style="flex-wrap: wrap; display: flex; margin: 10px; width: 95%">
          <van-button round block type="primary" native-type="submit" @click="buy"> 确认赎回 </van-button>
        </div>
        <div style="width: 90%; height: 10px"></div>
      </div>
    </van-action-sheet>
    <!--输入密码遮罩-->
    <van-overlay :show="keyshow" @click="keyshow = false">
      <van-action-sheet :show="true" title="">
        <div style="height: 350px">
          <van-password-input :value="value" info="密码为 6 位数字" :error-info="errorInfo" :focused="showKeyboard" />
          <van-number-keyboard v-model="value" :show="showKeyboard" />
        </div>
      </van-action-sheet>
    </van-overlay>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent, nextTick, onMounted, reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import * as echarts from 'echarts'
  import { Dialog, Toast } from 'vant'
  import { useStore } from 'vuex'
  import {
    CurrencyBack,
    CurrencyPartBack,
    SharesFundBuy,
    SharesFundBack,
    SharesPartBack,
  } from '@/axios/business/finance.api'

  const store = useStore()
  console.log(store.state.positionFund)
  const router = useRouter()
  function onClickLeft() {
    router.go(-1)
  }

  // 曲线图
  // const echartInit = () => {
  //   const myChart = echarts.init(document.querySelector('#echartLine'))
  //   // 指定图表的配置项和数据
  //   const option = reactive({
  //     title: { text: '七日年化' },
  //     backgroundColor: 'white',
  //     tooltip: {
  //       trigger: 'axis',
  //     },
  //     xAxis: {
  //       data: ['1', '2', '3', '4', '5', '6', '7'],
  //     },
  //     yAxis: {},
  //     series: [
  //       {
  //         name: 'data',
  //         type: 'line',
  //         data: ['0', '4', '2', '1', '8'],
  //         smooth: true,
  //         itemStyle: {
  //           color: 'hotpink',
  //         },
  //       },
  //     ],
  //   })
  //
  //   // 使用刚指定的配置项和数据显示图表。
  //   myChart.setOption(option)
  // }
  // 挂载
  onMounted(() => {
    // nextTick(() => {
    //   echartInit()
    // })
  })

  const show = ref(false)
  const moneydata = reactive({
    explaininput: '最多可赎回',
    // maxmoney: store.state.positionFund.showValue,
    maxmoney: store.state.positionFund.sharesHeld,
    maxcurrency: store.state.positionFund.showValue,
    leastmoney: '1.00',
    moneyFlag: false,
    erroInfo: '',
    money: '',
    mymoney: 7777,
    checked: false,
  })
  // 判断输入赎回金额是否合理
  function panduan() {
    // console.log(parseInt(moneydata.money) > 1 && parseInt(moneydata.money) < parseInt(moneydata.maxmoney))
    if (parseInt(moneydata.money) > 1 && parseInt(moneydata.money) < parseInt(moneydata.maxmoney)) {
      moneydata.moneyFlag = true
      moneydata.erroInfo = ''
    } else if (parseInt(moneydata.money) === 1 || parseInt(moneydata.money) === parseInt(moneydata.maxmoney)) {
      moneydata.moneyFlag = true
      moneydata.erroInfo = ''
    } else {
      moneydata.erroInfo = '当前金额大于或小于可赎回金额，请修改'
      moneydata.moneyFlag = false
    }
  }

  function panduanCurrency() {
    console.log(parseInt(moneydata.money) > 1 && parseInt(moneydata.money) < parseInt(moneydata.maxcurrency))
    console.log(parseInt(moneydata.money), parseInt(moneydata.maxcurrency))

    if (parseInt(moneydata.money) > 1 && parseInt(moneydata.money) < parseInt(moneydata.maxcurrency)) {
      moneydata.moneyFlag = true
      moneydata.erroInfo = ''
    } else if (parseInt(moneydata.money) === 1 || parseInt(moneydata.money) === parseInt(moneydata.maxcurrency)) {
      moneydata.moneyFlag = true
      moneydata.erroInfo = ''
    } else {
      moneydata.erroInfo = '当前金额大于或小于可赎回金额，请修改'
      moneydata.moneyFlag = false
    }
  }

  // 赎回操作
  const value = ref('')
  const keyshow = ref(false)
  const errorInfo = ref('')
  const showKeyboard = ref(true)
  function buy() {
    if (moneydata.checked === false) {
      Dialog.confirm({
        title: '提示',
        message: '您还没有勾选协议请勾选。',
      })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        })
    }
    console.log(moneydata.moneyFlag)
    if (moneydata.moneyFlag === true) {
      show.value = false
      keyshow.value = true
    }
  }

  watch(value, (newVal) => {
    if (newVal.length === 6) {
      // errorInfo.value = '密码错误'
      const params = {
        id: store.state.positionFund.recordId,
        amount: moneydata.money,
      }

      const params2 = {
        id: store.state.positionFund.recordId,
        sharesHeld: moneydata.money,
      }
      if (store.state.positionFund.showType === '01') {
        if (moneydata.money === store.state.positionFund.showValue) {
          // 货币全部赎回
          CurrencyBack(params.id).then((res: any) => {
            console.log(res)
            if (res) {
              Toast.success('赎回成功')
              keyshow.value = false
            }
          })
        } else {
          // 货币基金部分赎回
          CurrencyPartBack(params.id, params.amount).then((res: any) => {
            console.log(res)
            if (res) {
              Toast.success('赎回成功')
              keyshow.value = false
            }
          })
        }
      }
      if (store.state.positionFund.showType === '02') {
        if (moneydata.money === store.state.positionFund.sharesHeld) {
          // 股票全部赎回
          SharesFundBack(params.id).then((res: any) => {
            console.log(res)
            if (res) {
              Toast.success('赎回成功')
              keyshow.value = false
            }
          })
        } else {
          // 股票部分赎回
          SharesPartBack(params2.id, params2.sharesHeld).then((res: any) => {
            console.log(res)
            if (res) {
              Toast.success('赎回成功')
              keyshow.value = false
            }
          })
        }
      }
    } else if (newVal.length > 6) {
      value.value = value.value.substring(0, value.value.length - 1)
    } else {
      errorInfo.value = ''
    }
  })

  function allredeem() {
    moneydata.money = moneydata.maxmoney
    moneydata.moneyFlag = true
    moneydata.erroInfo = ''
  }
  function allredeemCurrency() {
    moneydata.money = moneydata.maxcurrency
    moneydata.moneyFlag = true
    moneydata.erroInfo = ''
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
    .title {
      width: 95%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      background-color: white;
      border-radius: 10px;
      margin-top: 10px;
      box-shadow: 3px 3px 3px gainsboro;
      .tableTitle {
        position: relative;
        margin: 0 auto;
        margin-top: 10px;
        width: 600px;
        height: 1px;
        background-color: #d4d4d4;
        text-align: center;
        font-size: 16px;
        color: rgba(101, 101, 101, 1);
      }
    }
    .profit {
      width: 95%;
      height: 100%;
      background-color: white;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      margin-top: 10px;
      box-shadow: 3px 3px 3px gainsboro;
    }
    .bottom {
      position: fixed;
      left: 0px;
      bottom: 0px;
      width: 100%;
      height: 50px;
      color: white;
      background-color: #198cff;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .content {
      width: 100%;
      min-height: 100%;
      background-color: rgb(245, 245, 245);

      .top {
        width: 100%;
      }

      .min {
        width: 100%;
        margin-top: 10px;
      }

      .money {
        height: 170px;
        width: 100%;
        margin-top: 10px;
        background-color: white;

        p {
          text-align: left;
          margin-left: 15px;
        }

        .input {
          display: flex;
          align-items: center;
          padding-left: 10px;

          img {
            height: 45px;
            width: 45px;
          }

          input {
            height: 45px;
            width: 80%;
            border: none;
            padding-left: 10px;
            font-size: 20px;
            font-weight: 777;
            background-color: transparent;
            caret-color: green;
            color: orange;
          }
        }

        .border {
          border-bottom: 1px solid #d9e0e7;
          margin-left: 15px;
          margin-right: 15px;
          margin-top: 5px;
        }
      }
    }
    .van-password-input {
      margin-top: 50px;
    }
  }
</style>
