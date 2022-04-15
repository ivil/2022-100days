<template>
  <TransactionNav :title="title" />
  <div class="electronicAccount">
    <div class="divider"></div>
    <van-row align="center">
      <van-col span="6">
        <img class="avator" src="../../assets/transaction/badCat.png" />
      </van-col>
      <van-col span="12">
        <span style="color: orange">
          <template v-if="!showElectronicAccount">
            {{
              electronicAccount.Id.substring(0, 4) +
              ' ****** ' +
              electronicAccount.Id.substring(electronicAccount.Id.length - 4)
            }}
          </template>
          <template v-if="showElectronicAccount">
            {{ electronicAccount.Id }}
          </template>
        </span>
      </van-col>
      <van-col span="3">
        <template v-if="!showElectronicAccount">
          <img @click="showElCardId" src="@/assets/transaction/hideEyes.png" class="eye" />
        </template>
        <template v-if="showElectronicAccount">
          <img @click="showElCardId" src="@/assets/transaction/showEyes.png" class="eye" />
        </template>
      </van-col>
    </van-row>
    <div class="divider"></div>
    <van-row align="center">
      <van-col span="8">
        <span style="font-size: 14px">账户余额</span>
        <div style="margin-top: 5px">
          <span>￥</span>
          <template v-if="!showElectronicAccount">
            {{ ' *** *** ***' }}
          </template>
          <template v-if="showElectronicAccount">
            <span style="color: red"> {{ electronicAccount.money }}</span>
          </template>
        </div>
      </van-col>
      <van-col span="6"
        ><van-button @click="toRecharge" class="dealBtn" type="primary" plain round>充值</van-button></van-col
      >
      <van-col span="8"
        ><van-button @click="toWithdraw" class="dealBtn" type="primary" plain round>提现</van-button></van-col
      >
    </van-row>
    <div class="divider"></div>
  </div>
  <div class="divider"></div>

  <div class="bankCards">
    <template v-for="(item, index) in cardList" :key="index">
      <div class="card">
        <van-row>
          <van-col span="6" offset="1">
            <img class="cardImg" src="../../assets/transaction/bankcard.png" alt="" />
            <van-tag @click="showDetail" color="white" text-color="green">查看详情</van-tag>
          </van-col>
          <van-col offset="2" span="15">
            <br />
            <van-row align="center">
              <span style="color: orange">
                <template v-if="showCard">
                  {{ item.cardId }}
                </template>
                <template v-if="!showCard">
                  {{ ' **** **** **** ' + item.cardId.substring(item.cardId.length - 4) }}
                </template>
              </span>
            </van-row>
            <div class="divider"></div>
            <van-row @click="showCardId">
              <van-col
                ><van-tag color="#198CFF" size="medium" plain>{{ item.bankName }}</van-tag></van-col
              >
              <van-col offset="1"
                ><template v-if="!showCard">
                  <img src="@/assets/transaction/hideEyes.png" class="eye" />
                </template>
                <template v-if="showCard">
                  <img src="@/assets/transaction/showEyes.png" class="eye" /> </template></van-col
              ><span style="font-size: 14px">查看全卡号</span>
            </van-row>
            <div class="divider"></div>
            <van-row @click="showBalance" style="font-size: 14px">
              <van-col
                ><template v-if="!showCardMoney">
                  <img src="@/assets/transaction/hideEyes.png" class="eye" />
                </template>
                <template v-if="showCardMoney">
                  <img src="@/assets/transaction/showEyes.png" class="eye" />
                </template>
              </van-col>
              <van-col
                ><span>可用余额：</span
                ><template v-if="!showCardMoney">
                  <span style="color: red">{{ ' *** *** *** ' }}</span> <span> 元</span>
                </template>
                <template v-if="showCardMoney">
                  <span style="color: red">{{ item.balance }}</span> <span> 元</span>
                </template>
              </van-col>
            </van-row>
          </van-col>
        </van-row>
        <div class="divider"></div>
        <van-row align="center">
          <van-col span="6"
            ><van-tag @click="toQuery(item)" color="white" text-color="#198CFF" size="large">查明细</van-tag></van-col
          >
          <van-col span="6"
            ><van-tag @click="toTransfer" color="white" text-color="#198CFF" size="large">去转账</van-tag></van-col
          >
          <van-col span="6"
            ><van-tag @click="toBuyFinanceProduct" color="white" text-color="#198CFF" size="large"
              >买理财</van-tag
            ></van-col
          >
          <van-col span="6"
            ><van-tag @click="toUnbindCard(item)" color="white" text-color="#198CFF" size="large"
              >解绑卡</van-tag
            ></van-col
          >
        </van-row>
        <div class="divider"></div>
      </div>
    </template>
  </div>
  <div class="footer">
    <div class="divider"></div>
    <van-button @click="addNewCard" class="button" plain type="primary">+ 添加新卡片</van-button>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from '@vue/reactivity'
  import { Dialog, Toast } from 'vant'
  import TransactionNav from '@/components/TransactionNav.vue'
  import router from '@/router/index'
  import { getBankCardList } from '@/axios/business/transaction.api'
  // 导航栏标题
  const title = ref('余额查询')
  // 电子账户信息
  const electronicAccount = reactive({
    Id: '6666 **** 9999',
    money: '9999999.71',
  })
  // 银行卡列表
  const cardList: any = ref([
    {
      bankName: '中国银行储蓄卡',
      cardId: '9797',
      dailyMoney: '100010.00',
      balance: '1000000.00',
    },
  ])
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
          card.bankName = el.bankType
          card.cardId = el.cardNumber
          card.dailyMoney = el.dailyMoney
          card.balance = el.cardMoney
          temp.push(card)
        } else {
          electronicAccount.Id = el.cardNumber
          electronicAccount.money = el.cardMoney
        }
      })
      cardList.value = temp
    }
    loading.close()
  })
  const showElectronicAccount = ref(false)
  // 展示电子账户账号
  const showElCardId = () => {
    showElectronicAccount.value = !showElectronicAccount.value
  }
  // 展示电子账户余额
  const showElCardMoney = () => {
    Dialog.alert({
      message: 'hello',
    })
  }
  // 去充值
  const toRecharge = () => {
    Dialog.confirm({
      allowHtml: true,
      message: `<h3>是否前往充值？</h3>`,
    })
      .then(() => {
        router.push('/transaction/recharge')
      })
      .catch(() => {})
  }
  // 去转账
  const toWithdraw = () => {
    Dialog.confirm({
      allowHtml: true,
      message: `<h3>是否前往提现？</h3>`,
    })
      .then(() => {
        router.push('/transaction/withdraw')
      })
      .catch(() => {})
  }
  // 查看详情
  const showDetail = () => {
    Dialog.alert({
      message: 'hello',
    })
  }
  const showCard = ref(false)
  // 展示银行卡账号
  const showCardId = () => {
    showCard.value = !showCard.value
  }
  const showCardMoney = ref(false)
  // 展示银行卡余额
  const showBalance = () => {
    showCardMoney.value = !showCardMoney.value
  }
  // 查明细
  const toQuery = (card: any) => {
    router.push({
      path: '/transaction/record',
      query: {
        id: card.cardId || '',
      },
    })
  }
  // 去转账
  const toTransfer = () => {
    Dialog.alert({
      message: 'hello',
    })
  }
  // 买理财
  const toBuyFinanceProduct = () => {
    Dialog.alert({
      message: 'hello',
    })
  }
  // 解绑卡
  const toUnbindCard = (card: any) => {
    Dialog.confirm({
      message: '确认解绑此卡？',
    })
      .then(() => {
        router.push({
          path: '/unBindCard',
          query: {
            id: card.cardId,
          },
        })
      })
      .catch(() => {})
  }
  // 添加新卡片
  const addNewCard = () => {
    Dialog.alert({
      message: 'hello',
    })
  }
</script>

<style lang="less" scoped>
  /deep/.van-row--align-center {
    margin-left: 20px;
  }
  .electronicAccount {
    background-color: whitesmoke;
    position: fixed;
    left: 0;
    right: 0;
    top: 50px;
    .avator {
      width: 50px;
      height: 50px;
    }
    .dealBtn {
      height: 30px;
      background-color: transparent;
    }
  }
  .bankCards {
    position: fixed;
    right: 0;
    left: 0;
    top: 179px;
    bottom: 50px;
    overflow-y: auto;
    background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
    .card {
      width: 95%;
      margin: 10px auto;
      // background-color: white;
      border-radius: 10px;
      box-shadow: 1px 1px 5px #198cff;
      .cardImg {
        width: 80px;
        height: 60px;
      }
    }
  }
  .footer {
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0px;
    height: 50px;
    background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
    .button {
      width: 94%;
      background-color: transparent;
      font-size: 17px;
      letter-spacing: 3px;
      margin-top: -10px;
      margin-left: 3%;
    }
  }
  // 换行
  .divider {
    height: 10px;
  }

  .eye {
    width: 21px;
    height: 21px;
  }
</style>
