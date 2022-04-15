<template>
  <van-nav-bar title="产品详情" left-text="返回" left-arrow @click-left="onClickLeft" />
  <div class="box">
    <div class="top">
      <div class="title">
        <span style="width: 90%; margin: 10px 0 0 10px; height: 40%">{{ store.state.oneFund.name }}</span
        ><van-tag
          plain
          round
          size="medium"
          type="primary"
          color="#198cff"
          text-color="#198cff"
          style="margin-left: 10px"
          >代销</van-tag
        >
        <van-tag plain round size="medium" type="primary" color="#198cff" text-color="#198cff" style="margin-left: 10px"
          >我的理财</van-tag
        >
      </div>
      <div class="riskLevel">
        <div style="width: 100%; height: 20px; margin-top: 10px" v-if="store.state.oneFund.riskLevel === '01'">
          <van-tag round color="#ffe1e1" text-color="#ad0000">低风险</van-tag>
        </div>
        <div style="width: 100%; height: 20px; margin-top: 10px" v-if="store.state.oneFund.riskLevel === '02'">
          <van-tag round color="#ffe1e1" text-color="#ad0000">高风险</van-tag>
        </div>
        <div style="width: 100%; height: 20px; margin-top: 10px">
          <van-tag round color="#ffe1e1" text-color="#ad0000">人民币</van-tag>
        </div>
      </div>
      <div class="rate">
        <div style="width: 100%; height: 50px; margin: 10px 0 10px 10px">
          <span style="font-size: 25px; color: rgb(218, 90, 43)">{{ store.state.oneFund.todayIncrease }}%</span>
          <br />
          <span style="font-size: small">近七日年化率</span>
        </div>
      </div>
      <div class="shuhui">
        <div style="width: 100%; height: 50px; margin: 10px 0 10px 10px">
          <span style="">{{ store.state.oneFund.introduce }}</span>
          <br />
          <div style="margin-top: 7px"><span style="font-size: small; color: darkgray">需操作赎回</span></div>
        </div>
      </div>
    </div>
    <div class="step">
      <van-steps :active="active">
        <van-step>购买日</van-step>
        <van-step>确认日</van-step>
        <van-step>查看收益日</van-step>
      </van-steps>
      <div style="display: flex; justify-content: space-between; width: 100%">
        <div style="margin: 0 0 10px 10px"><span style="font-size: small; color: #999">今日15点前</span></div>
        <div style="margin: 0 20px 10px 0"><span style="font-size: small; color: #999">04/16</span></div>
        <div style="margin: 0 15px 10px 0"><span style="font-size: small; color: #999">04/17</span></div>
      </div>
    </div>
    <div class="profit">
      <div id="echartLine" class="echartDiv" ref="echarTable" style="width: 90%; height: 350px"></div>
    </div>
    <div style="width: 100%; height: 80px"></div>
    <div class="bottom" @click="show = true"><div>购买</div></div>
    <!--购买遮罩-->
    <van-action-sheet v-model:show="show" title="理财购买">
      <div class="content">
        <div style="width: 100%; height: 10px"></div>
        <van-cell-group>
          <van-cell :title="store.state.oneFund.name" value="人民币" />
          <van-cell title="可用余额" :value="store.state.assets" />
        </van-cell-group>
        <div class="money">
          <br />
          <p>购买金额</p>
          <div class="input">
            <img src="../../assets/transaction/peopleMoney.png" />
            <input
              v-model="moneydata.money"
              type="text"
              :placeholder="moneydata.explaininput + store.state.oneFund.minimum"
              @blur="panduan"
            />
          </div>
          <div class="border"></div>
          <div style="width: 100%; display: flex">
            <span style="color: red; font-size: small; margin-left: 20px">{{ moneydata.erroInfo }}</span>
          </div>
        </div>
        <div style="width: 94%; height: 70px; background-color: white; margin-top: 10px; padding: 10px">
          <span style="color: orange; font-size: small">交易规则:</span>
          <p style="font-size: small">
            购买金额必须大于等于最低起购金额({{ store.state.oneFund.minimum }}元)，<br />
            且低于最高限额({{ store.state.oneFund.ceiling }}元)
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
        <div style="flex-wrap: wrap; display: flex; margin: 15px">
          <van-button round block type="primary" native-type="submit" @click="buy"> 确认购买 </van-button>
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
  import { reactive, onMounted, nextTick, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import * as echarts from 'echarts'
  import { Dialog, Toast } from 'vant'
  import { useStore } from 'vuex'
  import { CurrencyFundBuy, SharesFundBuy } from '@/axios/business/finance.api'

  const store = useStore()
  const active = ref(3)
  const router = useRouter()
  function onClickLeft() {
    router.go(-1)
  }

  // console.log(store.state.rate[0].todayIncrease)
  const echarTable = ref()

  const echartInit = () => {
    // const myChart = echarts.init(document.querySelector('#echartLine'))
    const myChart = echarts.init(echarTable.value)
    console.log(echarTable.value)
    // 指定图表的配置项和数据
    const option = reactive({
      title: { text: '七日年化' },
      backgroundColor: 'white',
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        data: ['1', '2', '3', '4', '5', '6', '7'],
      },
      yAxis: {
        axisLabel: {
          formatter: '{value}%',
        },
      },
      series: [
        {
          name: 'data',
          type: 'line',
          data: [
            store.state.rate[0].todayIncrease,
            store.state.rate[1].todayIncrease,
            store.state.rate[2].todayIncrease,
            store.state.rate[3].todayIncrease,
            store.state.rate[4].todayIncrease,
            store.state.rate[5].todayIncrease,
            store.state.rate[6].todayIncrease,
          ],
          smooth: true,
          itemStyle: {
            color: 'hotpink',
          },
        },
      ],
    })

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }

  // console.log(store.state.oneFund)
  // 挂载
  onMounted(() => {
    setTimeout(() => {
      echartInit()
    }, 100)
  })
  const show = ref(false)
  const moneydata = reactive({
    explaininput: '最小购买金额',
    moneyFlag: false,
    erroInfo: '',
    money: '',
    mymoney: 7777,
    checked: false,
    x: [],
    y: [],
  })

  // store.state.oneFund.rate

  function panduan() {
    const mony = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
    console.log(parseInt(moneydata.money) < parseInt(store.state.oneFund.minimum))
    console.log(parseInt(moneydata.money) < parseInt(store.state.oneFund.minimum))
    if (mony.test(moneydata.money)) {
      if (parseInt(moneydata.money) > parseInt(store.state.oneFund.ceiling)) {
        moneydata.erroInfo = '购买金额不得超过最大金额'
        moneydata.moneyFlag = false
      } else if (parseInt(moneydata.money) < parseInt(store.state.oneFund.minimum)) {
        moneydata.erroInfo = '购买金额需要大于起购金额'
        moneydata.moneyFlag = false
      } else if (parseInt(moneydata.money) > parseInt(store.state.assets)) {
        moneydata.erroInfo = '当前余额不足以购买此产品'
        moneydata.moneyFlag = false
      } else {
        moneydata.erroInfo = ''
        moneydata.moneyFlag = true
      }
    } else {
      moneydata.erroInfo = '请输入最多两位小数的购买金额'
    }
  }
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
    if (moneydata.moneyFlag === true && moneydata.erroInfo === '') {
      show.value = false
      keyshow.value = true
    }
  }

  watch(value, (newVal) => {
    if (newVal.length === 6) {
      const params = {
        productsId: store.state.oneFund.id,
        principal: moneydata.money,
        password: newVal,
      }
      if (store.state.oneFund.type === '02') {
        // 股票基金购买
        SharesFundBuy(params).then((res: any) => {
          console.log(res)
          if (res) {
            Toast.success('购买成功')
            keyshow.value = false
          }
        })
      } else {
        // 货币基金购买
        CurrencyFundBuy(params).then((res: any) => {
          console.log(res)
          if (res) {
            Toast.success('购买成功')
            keyshow.value = false
          }
        })
      }

      // errorInfo.value = '密码错误'
    } else if (newVal.length > 6) {
      value.value = value.value.substring(0, value.value.length - 1)
    } else {
      errorInfo.value = ''
    }
  })
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
    .top {
      width: 95%;
      display: flex;
      height: 150px;
      flex-wrap: wrap;
      background-color: white;
      border-radius: 10px;
      margin-top: 55px;
      box-shadow: 3px 3px 3px gainsboro;
      .title {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        height: 50%;
        width: 80%;
      }
      .rate {
        width: 45%;
        display: flex;
      }
      .shuhui {
        width: 55%;
        display: flex;
      }
    }
    .step {
      width: 95%;
      height: 100%;
      border-radius: 10px;
      margin-top: 10px;
      background-color: white;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      overflow: hidden;
      box-shadow: 3px 3px 3px gainsboro;
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
    /deep/.van-steps {
      width: 100%;
    }
    .van-password-input {
      margin-top: 50px;
    }
  }
  .van-nav-bar {
    position: fixed;
    width: 100%;
  }
  .content {
    width: 100%;
    min-height: 100%;
    background-color: rgb(245, 245, 245);
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
</style>
