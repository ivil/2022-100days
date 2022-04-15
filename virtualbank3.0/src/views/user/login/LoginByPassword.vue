<template>
  <div class="header">
    <Navigation :title="title" />
  </div>
  <div class="body">
    <br />
    <div class="logo"></div>
    <br />
    <br />
    <van-row justify="center" align="center">
      <van-col span="2" offset="1"><van-icon name="manager-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input @keyup="checkPhone" v-model="form.phone" placeholder="请输入11位手机号" class="input" type="number"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.phone }}</div>
    <van-row justify="center" align="center">
      <van-col span="2" offset="1"><van-icon name="bulb-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input @keyup="checkPassword" v-model="form.password" placeholder="请输入密码" class="input" type="password"
      /></van-col>
      <van-col span="6"
        ><span @click="router.push('/retrievePassword')" style="color: #198cff; padding-left: 15px"
          >忘记密码</span
        ></van-col
      >
    </van-row>
    <div class="error">{{ errors.password }}</div>

    <!--    <van-row justify="center" align="center">-->
    <!--      <van-col span="2" offset="1"><van-icon name="comment-o" color="#198cff" size="22" /></van-col>-->
    <!--      <van-col span="14"-->
    <!--        ><input @keyup="checkCode" v-model="form.captcha" placeholder="请输入图形验证码" class="input" type="text"-->
    <!--      /></van-col>-->
    <!--      <van-col span="6"><img @click="updateCaptcha" class="captcha" :src="captcha" alt="" srcset="" /></van-col>-->
    <!--    </van-row>-->
    <div class="error">{{ errors.code }}</div>
    <van-row jutify="center">
      <van-button class="button" plain type="primary" @click="submit">登录</van-button>
    </van-row>
    <br />
    <br />
    <div class="protocol">
      <van-checkbox shape="square" v-model="checked">我已阅读并同意</van-checkbox>
      <span style="color: #198cff" @click="showProtocol">《笨鸟银行的协议》</span>
    </div>
    <div class="login">
      <span @click="router.push('/loginByPhone')">手机号登录</span>
      &nbsp;
      <span @click="router.push('/register')">去注册</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { Dialog, Notify, Toast } from 'vant'
  import { useStore } from 'vuex'
  import Navigation from '@/components/Navigation.vue'
  import { getCaptcha, checkCaptcha } from '@/axios/common/common.api'
  import { loginByPassword } from '@/axios/business/user.api'
  import router from '@/router/index'
  import { Check } from '@/utils/Check'
  import { getBankCardList } from '@/axios/business/transaction.api'

  const store = useStore()
  const captcha = ref(getCaptcha + Math.random())

  // getCaptcha(Math.random()).then((value) => {
  //   console.log('验证码测试', value)
  // })
  const title = ref('密码登录')
  const checked = ref(false)
  const errors = reactive({
    phone: '',
    password: '',
    code: '',
  })
  // 表单
  const form = reactive({
    phone: '',
    password: '',
    captcha: '',
    imgId: '',
  })

  // 展示用户协议
  const showProtocol = () => {
    Dialog.alert({
      message: '这是用户协议',
    })
  }
  // 刷新图形验证码
  const updateCaptcha = () => {
    captcha.value = getCaptcha + Math.random()
    // 新的
    // captcha.value = getCaptcha(Math.random())
    // console.log(captcha.value)
  }
  // 提交
  const submit = () => {
    checkPhone()
    checkPassword()
    // checkCode()
    if (errors.phone || errors.password || errors.code) {
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
      // const captchaData = {
      //   imgId: captcha.value.split('=')[1],
      //   photoCode: form.captcha,
      // }

      const submitData = {
        userPhone: form.phone,
        userPassword: form.password,
      }
      loginByPassword(submitData).then((value: any) => {
        if (value) {
          sessionStorage.setItem('token', value)
          store.commit('setToken', value)
          Toast.success('登录成功')
          router.push('/')
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
        loading.close()
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
  // 校验验证码
  const checkCode = () => {
    if (form.captcha != '') {
      errors.code = ''
    } else {
      errors.code = '请输入图形验证码！'
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
    .captcha {
      width: 100px;
      height: 40px;
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
