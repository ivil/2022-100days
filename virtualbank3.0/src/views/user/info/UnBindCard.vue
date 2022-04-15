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
      <van-col span="2" offset="1"><van-icon name="manager-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input @keyup="checkCardId" v-model="form.cardId" placeholder="请输入要解绑的卡号" class="input" type="number"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.cardId }}</div>
    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="manager-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input @keyup="checkPhone" v-model="form.phone" placeholder="请输入绑定手机号" class="input" type="number"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.phone }}</div>
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
    <br />
    <van-row jutify="center">
      <van-button class="button" plain type="primary" @click="next">下一步</van-button>
    </van-row>
    <br />
    <br />
  </div>
  <van-overlay :show="showDialog">
    <van-dialog
      :show="true"
      title="请输入支付密码"
      show-cancel-button
      @confirm="submit"
      @cancel="cancel"
      :overlay="false"
    >
      <van-password-input :value="form.payPassword" :length="6" :focused="true" />
    </van-dialog>
    <van-number-keyboard v-model="form.payPassword" :show="true" :maxlength="6" random-key-order />
  </van-overlay>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { Notify, Toast } from 'vant'
  import { useRoute } from 'vue-router'
  import Navigation from '@/components/Navigation.vue'
  import { getPhoneCode } from '@/axios/common/common.api'
  import { unBindCard } from '@/axios/business/user.api'
  import { Check } from '@/utils/Check'

  const route = useRoute()
  const title = ref('解绑卡')
  const sendCode = ref('发送验证码')
  const showDialog = ref(false)
  let time = 60
  const errors = reactive({
    cardId: '',
    phone: '',
    code: '',
  })
  const form = reactive({
    phone: '',
    code: '',
    codeKey: '',
    payPassword: '',
    cardId: route.query.id || '',
  })
  // 获取验证码
  const getCode = () => {
    checkPhone()
    if (errors.phone != '') {
      return
    }
    if (sendCode.value === '发送验证码') {
      getPhoneCode(form.phone).then((value: any) => {
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
  const next = () => {
    checkCardId()
    checkPhone()
    checkCode()
    if (errors.cardId || errors.phone || errors.code) {
      return
    }
    showDialog.value = true
  }
  // 提交
  const submit = () => {
    if (form.payPassword.length !== 6) {
      Notify({
        type: 'warning',
        message: '支付密码只能为6位纯数字！',
      })
      return
    }
    showDialog.value = false
    // 加载动画
    const loading = Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'circular',
      duration: 0,
      overlay: true,
    })
    const submitData = {
      cardId: form.cardId,
      payPassword: form.payPassword,
      code: form.code,
      codeKey: form.codeKey,
    }
    unBindCard(submitData).then((value) => {
      loading.close()
      if (value) {
        Toast.success('解绑成功')
        route.push('/')
      }
    })
  }
  // 取消
  const cancel = () => {
    showDialog.value = false
  }
  // 校验卡号
  const checkCardId = () => {
    if (Check.cardIdReg.test(String(form.cardId))) {
      errors.cardId = ''
    } else {
      errors.cardId = '请输入合法的银行卡号！'
    }
  }
  // 校验手机号
  const checkPhone = () => {
    if (Check.phoneReg.test(form.phone)) {
      errors.phone = ''
    } else {
      errors.phone = '请输入合法的11位手机号！'
    }
  }
  // 校验验证码
  const checkCode = () => {
    if (Check.phoneCodeReg.test(form.code)) {
      errors.code = ''
    } else {
      errors.code = '请输入验证码！'
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
  }
  .newPassword {
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      border: none;
      border-bottom: 1px solid grey;
      font-size: 18px;
      width: 100px;
      height: 40px;
      text-align: center;
    }
  }
</style>
