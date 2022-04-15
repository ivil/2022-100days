<template>
  <div class="header">
    <Navigation :title="title" />
  </div>
  <div class="body">
    <br />
    <div class="logo"></div>
    <br />
    <br />
    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="bulb-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input @keyup="checkName" v-model="form.name" placeholder="请输入姓名" class="input" type="text"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.name }}</div>
    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="bulb-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input
          @blur="getInfo"
          @keyup="checkCardId"
          v-model="form.cardId"
          placeholder="请输入银行卡号"
          class="input"
          type="text"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.ID }}</div>
    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="manager-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input v-model="form.bankName" readonly placeholder="请输入开户行" class="input" type="text"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error"></div>
    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="manager-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input v-model="form.beforehandPhone" readonly placeholder="预留手机号" class="input" type="number"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error"></div>

    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="comment-o" color="#198cff" size="22" /></van-col>
      <van-col span="12"
        ><input @keyup="checkCode" v-model="form.code" placeholder="请输入短信验证码" class="input" type="number"
      /></van-col>
      <van-col span="8"
        ><span style="color: #198cff; float: right" @click="getCode">{{ sendCode }}</span></van-col
      >
    </van-row>
    <div class="error">{{ errors.code }}</div>
    <!-- <br> -->

    <van-row jutify="center">
      <van-button class="button" plain type="primary" @click="submit">下一步</van-button>
    </van-row>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { Toast, Notify } from 'vant'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import Navigation from '@/components/Navigation.vue'
  import { getPhoneCode } from '@/axios/common/common.api'
  import { getCardInfo, bindCard } from '@/axios/business/user.api'
  import { Check } from '@/utils/Check'

  const router = useRouter()
  const store = useStore()
  const title = ref('绑卡')
  const sendCode = ref('发送验证码')
  let time = 60
  const errors = reactive({
    name: '',
    ID: '',
    code: '',
  })
  // 表单
  const form = reactive({
    name: '',
    cardId: '',
    bankName: '',
    beforehandPhone: '',
    code: '',
    codeKey: '',
  })
  // 获取验证码
  const getCode = () => {
    if (form.beforehandPhone == '') {
      Notify({
        type: 'warning',
        message: '请先输入合法的银行卡号！',
      })
      return
    }
    if (sendCode.value === '发送验证码') {
      getPhoneCode(form.beforehandPhone).then((value: any) => {
        if (value) {
          form.codeKey = value
          Toast.success('验证码获取成功')
        }
      })
      sendCode.value = '60秒后重新获取'
      const timer = setInterval(() => {
        time--
        sendCode.value = `${time}秒后重新获取`
        if (time === 0) {
          clearInterval(timer)
          time = 60
          sendCode.value = '发送验证码'
        }
      }, 1000)
    } else {
    }
  }
  // 根据卡号回显开户行和预留手机号
  const getInfo = () => {
    checkCardId()
    console.log(form.cardId)
    if (errors.ID === '') {
      getCardInfo(form.cardId).then((value: any) => {
        if (value) {
          form.bankName = '工商银行'
          form.beforehandPhone = value
        }
      })
    }
  }
  // 提交
  const submit = () => {
    checkName()
    checkCardId()
    checkCode()
    if (errors.ID || errors.code || errors.name) {
      return
    }
    // 加载动画
    const loading = Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'circular',
      duration: 0,
      overlay: true,
    })
    const submitData = {
      cardNumber: form.cardId,
      codeKey: form.codeKey,
      codeData: form.code,
    }
    bindCard(submitData).then((value) => {
      loading.close()
      if (value) {
        Toast.success('绑卡成功')
        store.commit('setStatusOfBC', true)
        router.push('/')
      }
    })
  }
  // 校验姓名
  const checkName = () => {
    if (form.name != '') {
      errors.name = ''
    } else {
      errors.name = '请输入姓名！'
    }
  }
  // 校验银行卡号
  const checkCardId = () => {
    if (Check.cardIdReg.test(form.cardId)) {
      errors.ID = ''
    } else {
      errors.ID = '请输入合法的银行卡号！'
    }
  }
  const checkCode = () => {
    if (Check.phoneCodeReg.test(form.code)) {
      errors.code = ''
    } else {
      errors.code = '短信验证码只能为6位纯数字！'
    }
  }
</script>

<style lang="less" scoped>
  .header {
    overflow: hidden;
  }
  .body {
    padding-left: 5px;
    padding-right: 5px;
    .error {
      font-size: 10px;
      color: orangered;
      text-align: center;
      height: 35px;
    }
    .logo {
      height: 150px;
      background-color: whitesmoke;
      background-image: url('@/assets/images/img.png');
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
  }
</style>
