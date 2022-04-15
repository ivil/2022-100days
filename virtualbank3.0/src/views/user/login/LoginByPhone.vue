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
        ><input @keyup="checkPhone" v-model="form.phone" placeholder="请输入11位手机号" class="input" type="number"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.phone }}</div>

    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="comment-o" color="#198cff" size="22" /></van-col>
      <van-col span="12"
        ><input @keyup="checkCode" v-model="form.code" placeholder="请输入短信验证码" class="input" type="text"
      /></van-col>
      <van-col span="8"
        ><span style="color: #198cff; float: right" @click="getCode">{{ sendCode }}</span></van-col
      >
    </van-row>
    <div class="error">{{ errors.code }}</div>
    <!-- <br> -->

    <van-row jutify="center">
      <van-button class="button" plain type="primary" @click="submit">登录</van-button>
    </van-row>
    <br />
    <br />
    <div class="protocol">
      <van-checkbox v-model="checked" shape="square">我已阅读并同意</van-checkbox>
      <span style="color: #198cff" @click="showProtocol">《笨鸟银行的协议》</span>
    </div>
    <div class="login">
      <span @click="router.push('/loginByPassword')">密码登录</span>
      &nbsp;
      <span @click="router.push('/register')">去注册</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { Toast, Dialog } from 'vant'
  import { useStore } from 'vuex'
  import Navigation from '@/components/Navigation.vue'
  import { getPhoneCode } from '@/axios/common/common.api'
  import { loginByPhone } from '@/axios/business/user.api'
  import { getBankCardList } from '@/axios/business/transaction.api'
  import router from '@/router/index'
  import { Check } from '@/utils/Check'

  const store = useStore()

  const title = ref('手机号登录')
  const sendCode = ref('发送验证码')
  let time = 60
  // 校验
  const errors = reactive({
    phone: '',
    code: '',
  })
  // 表单
  const checked = ref(false)
  const form = reactive({
    phone: '',
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
  // 提交
  const submit = () => {
    checkPhone()
    checkCode()
    if (errors.phone || errors.code) {
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
        phoneCode: form.code,
        codeKey: form.codeKey,
      }
      loginByPhone(submitData).then((value: any) => {
        loading.close()
        if (value) {
          sessionStorage.setItem('token', value)
          store.commit('setToken', value)
          Toast.success('登录成功')
          router.push('/')
          // 判断是否开户绑卡
          getBankCardList().then((value: any) => {
            if (value) {
              value.forEach((el: any) => {
                if (el.cardType === '2') {
                  store.commit('setStatusOfOA', true)
                }
                if (el.cardType === '1') {
                  store.commit('setStatusOfBC', true)
                }
              })
            }
          })
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
  // 校验验证码
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
