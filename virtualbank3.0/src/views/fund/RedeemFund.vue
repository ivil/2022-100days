<template>
  <van-nav-bar title="基金赎回" left-text="返回" left-arrow @click-left="onClickLeft" />
  <div class="box">
    <div class="top">
      <van-cell title="阳光雪碧2号(EW202A)" value="可赎回" size="medium" />
    </div>
    <div class="min">
      <van-cell title="可用份额" :value="moneydata.maxmoney" size="medium" />
      <van-cell title="最低赎回份额" :value="moneydata.leastmoney" size="medium" />
    </div>
    <div class="money">
      <br />
      <p>赎回份额</p>
      <div class="input">
        <img src="../../assets/transaction/peopleMoney.png" />
        <input
          v-model="moneydata.money"
          type="text"
          :placeholder="moneydata.explaininput + moneydata.maxmoney"
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
    <div style="flex-wrap: wrap; display: flex; margin: 17px; width: 95%">
      <van-button round block type="primary" native-type="submit" @click="buy"> 确认赎回 </van-button>
    </div>

    <!--赎回密码遮罩-->
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
  import { useRouter } from 'vue-router'
  import { reactive, ref, watch } from 'vue'
  import { Dialog } from 'vant'

  const router = useRouter()
  function onClickLeft() {
    router.go(-1)
  }
  const moneydata = reactive({
    explaininput: '最多可赎回',
    maxmoney: '77.00',
    leastmoney: '1.00',
    moneyFlag: false,
    erroInfo: '',
    money: '',
    mymoney: 777,
    checked: false,
  })
  // 判断输入赎回金额是否合理
  function panduan() {
    if (moneydata.money >= 1 && moneydata.money <= moneydata.maxmoney) {
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
    if (moneydata.moneyFlag === true) {
      keyshow.value = true
    }
  }

  watch(value, (newVal) => {
    if (newVal.length === 6 && newVal !== '123456') {
      errorInfo.value = '密码错误'
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
    .van-password-input {
      margin-top: 50px;
    }
  }
</style>
