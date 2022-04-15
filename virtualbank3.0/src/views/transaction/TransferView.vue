<template>
  <TransactionNav :title="title" />
  <div class="body">
    <van-cell-group>
      <br />
      <van-cell clickable is-link center @click="showCards = true">
        <template #title>
          <span style="margin-left: 10px" class="custom-title">付款账户</span>
          &nbsp;
          <van-tag type="primary" plain color="#198CFF">{{ pageInfo.bankName }}</van-tag>
        </template>
        <template #label style="min-width: 180px">
          <span style="margin-left: 10px">
            <span>可用余额：</span>
            <span style="color: red; min-width: 200px">{{ pageInfo.balance }} 元</span>
          </span>
        </template>
        <span style="color: black">{{
          pageInfo.cardId.substring(0, 4) + ' *** *** *** ' + pageInfo.cardId.substring(pageInfo.cardId.length - 4)
        }}</span>
      </van-cell>
      <br />
      <!-- <van-cell center>
        <div class="currency">
          <span>币种</span>
          <span>人民币元</span>
        </div>
      </van-cell> -->
      <van-cell>
        <!-- <div class="money">
          <div>转账金额</div>
          <input readonly v-model="pageInfo.money" placeholder="请输入" type="text" @click="showKeyboard = true" />
        </div> -->
        <div class="receiveInfo">
          <span>转账金额</span>
          <input
            readonly
            style="color: red"
            v-model="pageInfo.money"
            placeholder="请输入转账金额"
            type="text"
            @click="showKeyboard = true"
          />
          <img style="visibility: hidden" @click="scanning" src="../../assets/transaction/icon_xiangji.png" alt="" />
        </div>
        <van-number-keyboard
          v-model="pageInfo.money"
          @input="checkInput"
          :maxlength="19"
          :show="showKeyboard"
          theme="custom"
          extra-key="."
          close-button-text="完成"
          @blur="showKeyboard = false"
        />
      </van-cell>
      <!-- <br /> -->
      <div class="divider"></div>
      <van-cell center>
        <div class="receiveInfo">
          <span>收款人名称</span>
          <input v-model="pageInfo.toName" placeholder="请输入收款人姓名" type="text" />
          <img @click="addPayee" src="../../assets/transaction/lianXiPeople.png" alt="" />
        </div>
      </van-cell>
      <van-cell center>
        <div class="receiveInfo">
          <span>收款账号</span>
          <input v-model="pageInfo.toAccount" placeholder="请输入收款人账号" type="text" />
          <img @click="scanning" src="../../assets/transaction/icon_xiangji.png" alt="" />
        </div>
      </van-cell>
      <div class="divider"></div>
      <van-cell center>
        <!-- <div class="receiveInfo">
          <span>收款人开户行</span>
          <input v-model="pageInfo.toBank" type="text" />
          <img style="visibility: hidden" src="../../assets/transaction/pre_icon_openbank.png" alt="" />
        </div> -->
        <div class="receiveInfo">
          <span>开户行</span>
          <input v-model="pageInfo.toBank" type="text" placeholder="请输入收款人开户行" />
          <img style="visibility: hidden" @click="scanning" src="../../assets/transaction/icon_xiangji.png" alt="" />
        </div>
      </van-cell>
      <div class="divider"></div>
      <van-cell center>
        <!-- <div class="extra">
          <span>附言</span>
          <input v-model="pageInfo.postscript" placeholder="选填，最多十个汉字" type="text" />
        </div> -->
        <div class="receiveInfo">
          <span>附言</span>
          <input v-model="pageInfo.postscript" placeholder="选填，最多十个汉字" type="text" />
          <img style="visibility: hidden" @click="scanning" src="../../assets/transaction/icon_xiangji.png" alt="" />
        </div>
      </van-cell>
      <div class="divider"></div>
      <van-cell center>
        <div class="extra">
          <span>保存为常用联系人</span>
          <van-switch :model-value="pageInfo.checked" size="25px" @click="pageInfo.checked = !pageInfo.checked" />
        </div>
      </van-cell>
    </van-cell-group>
    <br />
    <br />
    <van-button class="button" type="primary" @click="next">下一步</van-button>
  </div>

  <!-- 选择银行卡 -->
  <van-action-sheet v-model:show="showCards">
    <van-cell>
      <div class="cardTitle">
        <img @click="cancelChoose" src="../../assets/transaction/daCha.png" />
        <h3>选择付款银行卡</h3>
        <span></span>
      </div>
    </van-cell>
    <van-cell clickable v-for="(item, index) in cardList" :key="index" @click="chooseCard(item)">
      <div class="cardList">
        <img src="../../assets/transaction/bankcard.png" />
        <div class="test" style="width: 10px"></div>
        <span>{{ item.bankName }} ({{ item.cardId.substring(item.cardId.length - 4) }})</span>
        <span style="font-size: 10px; display: flex"
          ><p>余额：</p>
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
        <span>使用新卡付款</span>
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

  <!-- 支付密码遮罩层 -->
  <van-overlay :show="showDialog">
    <van-dialog
      :show="true"
      title="请输入支付密码"
      show-cancel-button
      @confirm="confirmPayPassword"
      @cancel="cancelPay"
      :overlay="false"
    >
      <van-password-input :value="pageInfo.payPassword" :length="6" :focused="true" />
    </van-dialog>
    <van-number-keyboard v-model="pageInfo.payPassword" :show="true" :maxlength="6" random-key-order />
  </van-overlay>
</template>

<script lang="ts" setup>
  import { ref, reactive } from '@vue/reactivity'
  import { Dialog, Notify, Toast } from 'vant'
  import router from '@/router/index'
  import TransactionNav from '@/components/TransactionNav.vue'
  import { getBankCardList, transfer } from '@/axios/business/transaction.api'
  import { getCardInfo } from '@/axios/business/user.api'
  import { Check } from '@/utils/Check'
  import { encrypt } from '@/utils/Crypto'

  const title = ref('转账')
  const showCards = ref(false)
  const showDialog = ref(false)
  const showKeyboard = ref(false)
  // 银行卡列表
  const cardList: any = ref([
    // {
    //   bankName: '中国银行储蓄卡',
    //   cardId: '9797',
    //   checked: true,
    //   dailyMoney: '100010.00',
    //   balance: '1000000.00',
    // },
  ])
  // 页面信息
  const pageInfo = reactive({
    bankName: '',
    cardId: '',
    balance: '',
    money: '',
    toName: '',
    toBank: '',
    toAccount: '',
    postscript: '',
    checked: false,
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
    cardList.value = []
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
        pageInfo.cardId = cardList.value[0].cardId
        pageInfo.bankName = cardList.value[0].bankName
        pageInfo.balance = cardList.value[0].balance
        cardList.value[0].checked = true
      } catch (e) {}
    }
    loading.close()
  })

  // 根据卡号回显开户行
  // const getBankName = () => {
  //   if (Check.cardIdReg.test(pageInfo.toAccount)) {
  //     // 根据银行卡号获取开户行和预留手机号
  //     getCardInfo(pageInfo.toAccount).then((value: any) => {
  //       pageInfo.toBank = value.bankName
  //     })
  //   } else {
  //     Notify({
  //       message: '银行卡号格式不正确！',
  //       type: 'warning',
  //     })
  //   }
  // }

  // 取消选择
  const cancelChoose = () => {
    showCards.value = false
  }
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
  const checkInput = () => {
    setTimeout(() => {
      const reg = /^[0-9]+([.]{1}[0-9]{0,2}){0,1}$/
      if (!reg.test(pageInfo.money)) {
        pageInfo.money = pageInfo.money.substring(0, pageInfo.money.length - 1)
      }
    }, 50)
  }
  // 确认选择付款账户
  const confirmCard = () => {
    cardList.value.forEach((el: any) => {
      if (el.checked) {
        pageInfo.bankName = el.bankName
        pageInfo.cardId = el.cardId
        pageInfo.balance = el.balance
      }
    })
    showCards.value = false
  }
  // 添加新卡
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
  // 自动填充收款人信息
  const addPayee = () => {
    Dialog.confirm({
      allowHtml: true,
      message: `<h3>是否选择常用联系人？</h3>`,
    })
      .then(() => {
        console.log('okk')
      })
      .catch(() => {})
  }
  // 扫描银行卡自动填充卡号
  const scanning = () => {
    Dialog.confirm({
      allowHtml: true,
      message: `<h3>是否扫描银行卡自动填充卡号？</h3>`,
    })
      .then(() => {
        console.log('okk')
      })
      .catch(() => {})
  }

  // 下一步
  const next = () => {
    if (pageInfo.money == '' || pageInfo.toBank == '' || pageInfo.toName == '' || pageInfo.toAccount == '') {
      Notify({
        type: 'warning',
        message: '请检查收款人信息是否输入正确！',
      })
      return
    }
    if ((pageInfo.money === '0.00')) {
      Notify({
        type: 'warning',
        message: '转账金额不能为0！',
      })
      return
    }
    if (!Check.cardIdReg.test(pageInfo.toAccount)) {
      Notify({
        type: 'warning',
        message: '请输入合法的银行卡号！',
      })
      return
    }
    showDialog.value = true
  }

  // 支付密码对话框的确认按钮，表单提交操作
  const confirmPayPassword = () => {
    if (pageInfo.payPassword.length !== 6) {
      Notify({
        type: 'warning',
        message: '支付密码只能为六位纯数字！！！',
      })
    } else {
      // 加载动画
      const loading = Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'circular',
        duration: 0,
        overlay: true,
      })
      // 要提交的表单数据
      const submitData = {
        toName: pageInfo.toName,
        toAccount: pageInfo.toAccount,
        fromAccount: pageInfo.cardId,
        money: pageInfo.money,
        payPassword: pageInfo.payPassword,
        bankType: pageInfo.toBank,
      }
      // 发送请求
      transfer(submitData).then((value: any) => {
        loading.close()
        if (value) {
          Toast.success('转账成功！')
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
</script>

<style lang="less" scoped>
  .divider {
    height: 5px;
  }
  /deep/.van-cell__label {
    min-width: 180px;
  }
  /deep/.van-cell,
  .van-cell-group,
  .van-switch,
  .van-switch__node {
    background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  }

  .body {
    position: fixed;
    left: 0;
    right: 0;
    top: 50px;
    bottom: 0;
    background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
    .currency {
      display: flex;
      justify-content: space-between;
      padding-left: 15px;
      padding-right: 10px;
    }
    .money {
      padding-left: 10px;
      div {
        font-size: small;
      }
      input {
        border: none;
        border-bottom: 1px solid grey;
        background-color: transparent;
        padding-left: 10px;
        color: red;
        font-size: 16px;
      }
    }
    .receiveInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 10px;
      span {
        min-width: 70px;
        font-weight: 600;
      }
      input {
        border: none;
        background-color: transparent;
        border-bottom: 1px solid grey;
        caret-color: green;
        padding-left: 10px;
      }
      img {
        width: 25px;
        height: 25px;
      }
    }
    .extra {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 10px;
      span {
        font-weight: 600;
      }
      input {
        width: 67%;
        border: none;
        border-bottom: 1px solid grey;
        caret-color: green;
        background-color: transparent;
        padding-left: 10px;
      }
    }
    .button {
      width: 90%;
      margin-left: 5%;
    }
  }
  // 选择银行卡列表样式
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
