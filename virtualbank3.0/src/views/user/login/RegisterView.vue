<template>
  <div class="header">
    <Navigation :title="title" />
  </div>
  <div class="body">
    <br />
    <div class="logo"></div>
    <br />
    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="manager-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input @keyup="checkPhone" v-model="form.phone" placeholder="请输入11位手机号" class="input" type="number"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.phone }}</div>
    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="bulb-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input @keyup="checkPassword" v-model="form.password" placeholder="请输入密码" class="input" type="password"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.password }}</div>
    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="bulb-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input
          @keyup="checkPasswordAgain"
          v-model="form.checkPassword"
          placeholder="请确认密码"
          class="input"
          type="password"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.checkPassword }}</div>
    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="comment-o" color="#198cff" size="22" /></van-col>
      <van-col span="12"
        ><input @keyup="checkPhoneCode" v-model="form.code" placeholder="请输入短信验证码" class="input" type="number"
      /></van-col>
      <van-col span="8"
        ><span @click="getCode" style="color: #198cff; float: right">{{ sendCode }}</span></van-col
      >
    </van-row>
    <div class="error">{{ errors.code }}</div>
    <van-row jutify="center">
      <van-button class="button" plain type="primary" @click="submit">注册</van-button>
    </van-row>
    <br />
    <br />
    <div class="protocol">
      <van-checkbox v-model="checked" shape="square">我已阅读并同意</van-checkbox>
      <span style="color: #198cff" @click="showProtocol">《笨鸟银行的协议》</span>
    </div>
    <div class="login">
      <span @click="router.push('/loginByPhone')">去登录</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { Dialog, Notify, Toast } from 'vant'
  import Navigation from '@/components/Navigation.vue'
  import router from '@/router/index'
  import { getPhoneCode } from '@/axios/common/common.api'
  import { register } from '@/axios/business/user.api'
  import { Check } from '@/utils/Check'

  const title = ref('注册')
  const checked = ref(false)
  const sendCode = ref('发送验证码')
  let time = 60
  // 校验
  const errors = reactive({
    phone: '',
    password: '',
    checkPassword: '',
    code: '',
  })
  // 表单信息
  const form = reactive({
    phone: '',
    password: '',
    checkPassword: '',
    code: '',
    codeKey: '',
  })
  // 展示用户协议
  const showProtocol = () => {
    Dialog.alert({
      message: '这是用户协议',
    })
  }
  // 获取验证码
  const getCode = () => {
    checkPhone()
    if (errors.phone != '') {
      return
    }
    if (sendCode.value === '发送验证码') {
      getPhoneCode(form.phone).then((value: any) => {
        if (value) {
          console.log(value)
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
    }
  }
  // 表单提交
  const submit = () => {
    checkPhone()
    checkPassword()
    checkPasswordAgain()
    checkPhoneCode()
    if (errors.phone || errors.password || errors.checkPassword || errors.code) {
      Notify({
        type: 'danger',
        message: '请检查输入！',
      })
      return
    }
    if (!checked.value) {
      Dialog.confirm({
        message: '请勾选用户协议',
      })
        .then(() => {
          checked.value = true
        })
        .catch(() => {})
    } else {
      // 加载动画
      const loading = Toast.loading({
        message: '加载中...',
        forbidClick: true,
        loadingType: 'circular',
        duration: 0,
        overlay: true,
      })
      const submitData = {
        userPhone: form.phone,
        userPassword: form.password,
        phoneCode: form.code,
        codeKey: form.codeKey,
      }
      register(submitData).then((value) => {
        loading.close()
        if (value) {
          Toast.success('注册成功')
          router.push('/loginByPassword')
        }
      })
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
  // 校验密码
  const checkPassword = () => {
    if (Check.passwordReg.test(form.password)) {
      errors.password = ''
    } else {
      errors.password = '密码长度至少为8，且至少含有一个字母和数字！'
    }
  }
  // 校验二次密码
  const checkPasswordAgain = () => {
    if (form.checkPassword === form.password) {
      errors.checkPassword = ''
    } else {
      errors.checkPassword = '两次密码不一致！'
    }
  }
  // 校验验证码
  const checkPhoneCode = () => {
    if (Check.phoneCodeReg.test(form.code)) {
      errors.code = ''
    } else {
      errors.code = '手机验证码只能为6位纯数字！'
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
