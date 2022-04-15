<template>
  <TransactionNav :title="title" />
  <div class="body">
    <div class="chooseCard">
      <van-cell class="cell" @click="showCards = true" clickable>
        <div class="cardInfo">
          <span> 提现方式 </span>
          <span>
            <h3>
              <img src="../../assets/transaction/bankcard.png" /> {{ formData.bankName }}({{
                formData.cardId.substring(formData.cardId.length - 4)
              }})
            </h3>
            <p style="font-size: 10px">单日交易限额：{{ formData.dailyMoney }}￥</p>
          </span>
          <span>
            <van-icon name="arrow" />
          </span>
        </div>
      </van-cell>
      <van-action-sheet v-model:show="showCards">
        <van-cell>
          <div class="cardTitle">
            <img @click="cancelChoose" src="../../assets/transaction/daCha.png" />
            <h3>选择到账银行卡</h3>
            <span></span>
          </div>
        </van-cell>
        <van-cell clickable v-for="(item, index) in cardList" :key="index" @click="chooseCard(item)">
          <div class="cardList">
            <img src="../../assets/transaction/bankcard.png" />
            <div class="test" style="width: 10px"></div>
            <span>{{ item.bankName }} ({{ item.cardId.substring(item.cardId.length - 4) }})</span>
            <span style="font-size: 10px; display: flex"
              ><p style="color: orange">余额：</p>
              <p style="color: red">{{ item.balance }}</p>
              <p>￥</p></span
            >
            <img v-if="item.checked === true" src="../../assets/transaction/gou.png" />
            <img style="visibility: hidden" v-else-if="item.checked === false" />
          </div>
        </van-cell>
        <van-cell clickable @click="rechargeByNewCard">
          <div class="cardList">
            <img src="../../assets/transaction/bankcard.png" />
            <span>提现到新卡</span>
            <img src="../../assets/transaction/right.png" />
          </div>
        </van-cell>
        <van-cell>
          <div class="ok">
            <van-button @click="confirmCard" class="button" round plain type="success"
              >确&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;认</van-button
            >
          </div>
        </van-cell>
      </van-action-sheet>
    </div>
    <div class="money">
      <br />
      <p>提现金额</p>
      <div class="input">
        <img src="../../assets/transaction/peopleMoney.png" />
        <input readonly v-model="formData.money" type="text" />
      </div>
      <div class="border"></div>
    </div>
    <van-number-keyboard
      v-model="formData.money"
      @input="checkInput"
      :maxlength="9"
      :show="showKeyboard"
      theme="custom"
      extra-key="."
      close-button-text="完成"
      @close="submit"
    />
  </div>

  <van-overlay :show="showDialog">
    <van-dialog
      :show="true"
      title="请输入支付密码"
      show-cancel-button
      @confirm="confirmPayPassword"
      @cancel="cancelPay"
      :overlay="false"
    >
      <van-password-input :value="formData.payPassword" :length="6" :focused="true" />
    </van-dialog>
    <van-number-keyboard v-model="formData.payPassword" :show="true" :maxlength="6" random-key-order />
  </van-overlay>
</template>

<script lang="ts" setup>
  import { computed, reactive, ref } from 'vue'
  import { Dialog, Notify, Toast } from 'vant'
  import TransactionNav from '../../components/TransactionNav.vue'
  import router from '../../router/index'
  import { withdrawRequest, getBankCardList } from '../../axios/business/transaction.api'
  import { encrypt } from '@/utils/Crypto'

  const title = '提现'
  // 展示银行卡列表
  const showCards = ref(false)
  // 展示支付密码会话
  const showDialog = ref(false)
  // 展示数字键盘
  const showKeyboard = computed(() => !showCards.value)
  // 银行卡列表
  const cardList: any = ref([
    {
      bankName: '中国银行储蓄卡',
      cardId: '9797',
      checked: true,
      dailyMoney: '50000.00',
      balance: '1000000.00',
    },
  ])
  // 页面表单数据
  const formData = reactive({
    cardId: '',
    bankName: '',
    dailyMoney: '',
    money: '',
    payPassword: '',
  })
  // 加载动画
  const loading = Toast.loading({
    message: '加载中...',
    forbidClick: true,
    loadingType: 'circular',
    duration: 0,
    overlay: true,
  })
  // 获取银行卡列表
  getBankCardList().then((value: any) => {
    if (value) {
      const temp: bankCard[] = []
      value.forEach((el: bankCard) => {
        if (el.cardType === '1') {
          const card: any = {}
          card.bankName = el.bankType || '工商银行'
          card.cardId = el.cardNumber
          card.dailyMoney = el.dailyMoney || '50000.00'
          card.balance = el.cardMoney
          card.checked = false
          temp.push(card)
        }
      })
      cardList.value = temp
      try {
        formData.cardId = cardList.value[0].cardId
        formData.bankName = cardList.value[0].bankName
        formData.dailyMoney = String(50000.0)
        cardList.value[0].checked = true
      } catch (e) {}
    }
    loading.close()
  })
  // 取消选择银行卡
  const cancelChoose = () => {
    showCards.value = false
  }
  // 选择银行卡,因为对传入数据做了修改,而eslint不允许修改传入参数，所以加了注释局部性跳过了eslint的校验
  /* eslint-disable no-param-reassign */
  const chooseCard = (item: {
    bankName: string
    cardId: string
    checked: boolean
    dailyMoney: string
    balance: string
  }) => {
    cardList.value.forEach((el: any) => {
      el.checked = false
    })
    item.checked = true
  }
  /* eslint-disable no-param-reassign */
  // 利用数字键盘按键回调校验数据是否合法
  const checkInput = () => {
    setTimeout(() => {
      const reg = /^[0-9]+([.]{1}[0-9]{0,2}){0,1}$/
      if (!reg.test(formData.money)) {
        formData.money = formData.money.substring(0, formData.money.length - 1)
      }
    }, 50)
  }
  // 确认所选择的付款账户
  const confirmCard = () => {
    cardList.value.forEach((el: any) => {
      if (el.checked) {
        formData.cardId = el.cardId
        formData.bankName = el.bankName
        formData.dailyMoney = el.dailyMoney
      }
    })
    showCards.value = false
  }
  // 表单提交操作
  const submit = () => {
    if (formData.money !== '') {
      const rechargeMoney = Number(formData.money)
      const dailyMoney = Number(formData.dailyMoney)
      if (false) {
        Dialog.alert({
          allowHtml: true,
          message: `<h3>提现金额超过每日限额！！！</h3>`,
        })
      } else {
        // 先转化为number类型再转换为string类型是为了过滤掉多个0开头的数据
        formData.money = String(rechargeMoney)
        showDialog.value = true
      }
    } else {
      Dialog.alert({
        allowHtml: true,
        message: `<h3>请输入提现金额！！！</h3>`,
      }).then(() => {
        // on confirm
      })
    }
  }
  // 确认支付密码，进行最终的表单提交操作
  const confirmPayPassword = () => {
    if (formData.payPassword.length !== 6) {
      Notify({
        type: 'warning',
        message: '支付密码只能为六位纯数字！！！',
      })
    } else {
      // 通过校验，发送请求
      // 加载动画
      const loading = Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'circular',
        duration: 0,
        overlay: true,
      })
      // 组合要提交的数据
      const submitData = {
        payPassword: formData.payPassword,
        money: formData.money,
        cardId: formData.cardId,
      }
      // 发送请求
      withdrawRequest(submitData).then((value) => {
        loading.close()
        if (value) {
          Toast.success({
            message: '提现成功！',
          })
          router.push('/')
        }
      })
      showDialog.value = false
    }
  }
  // 取消支付
  const cancelPay = () => {
    showDialog.value = false
  }
  // 绑定新卡
  const rechargeByNewCard = () => {
    Dialog.confirm({
      allowHtml: true,
      message: `<h3>是否前往绑卡页面绑定新银行卡?</h3>`,
    })
      .then(() => {
        // on confirm
        router.push('/bindCard')
      })
      .catch(() => {
        // on cancel
      })
  }

  // 校验
</script>

<style lang="less" scoped>
  .body {
    position: fixed;
    left: 0;
    right: 0;
    top: 50px;
    .chooseCard {
      height: 100px;
      .cell {
        height: 100%;
        background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
      }
      .cardInfo {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          h3 {
            display: flex;
            align-items: center;
            img {
              height: 20px;
              width: 20px;
              margin-right: 10px;
            }
          }
        }
      }
    }
    .money {
      height: 500px;
      background-color: white;
      background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
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
          font-size: 50px;
          font-weight: 777;
          background-color: transparent;
          caret-color: green;
          color: #ff4040;
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
  .cardTitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    img {
      height: 20px;
      width: 20px;
    }
  }
  .cardList {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    // font-size: 15px;
    span {
      width: 40%;
    }
    img {
      height: 25px;
      width: 25px;
    }
  }
  .ok {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    .button {
      width: 60%;
      font-size: 16px;
    }
  }
</style>
