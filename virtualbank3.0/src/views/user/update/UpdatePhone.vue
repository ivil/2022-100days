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
        ><input @keyup="checkPhone" v-model="form.oldPhone" placeholder="请输入原手机号" class="input" type="number"
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
  </div>
  <van-overlay :show="showDialog">
    <van-dialog
      :show="true"
      title="请输入新手机号"
      show-cancel-button
      @confirm="submit"
      @cancel="cancel"
      :overlay="false"
    >
      <div class="newPassword">
        <input type="number" v-model="form.newPhone" />
      </div>
    </van-dialog>
    <van-number-keyboard v-model="form.newPhone" :show="true" :maxlength="13" />
  </van-overlay>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { Toast, Dialog, Notify } from 'vant'
  import Navigation from '@/components/Navigation.vue'
  import { getPhoneCode } from '@/axios/common/common.api'
  import { updatePhone } from '@/axios/business/user.api'
  import { Check } from '@/utils/Check'
  import router from '@/router'

  const title = ref('修改手机号')
  const sendCode = ref('发送验证码')
  const showDialog = ref(false)
  let time = 60
  const errors = reactive({
    phone: '',
    code: '',
    newPhone: '',
  })
  const form = reactive({
    oldPhone: '',
    newPhone: '',
    codeKey: '',
    code: '',
  })
  // 获取验证码
  const getCode = () => {
    checkPhone()
    if (errors.phone != '') {
      return
    }
    if (sendCode.value === '发送验证码') {
      getPhoneCode(form.oldPhone).then((value: any) => {
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
  // 下一步
  const next = () => {
    checkPhone()
    checkCode()
    if (!(errors.phone || errors.code)) {
      showDialog.value = true
    }
  }
  // 提交
  const submit = () => {
    if (!Check.phoneReg.test(form.newPhone)) {
      Notify({
        type: 'warning',
        message: '请输入正确的手机号！',
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
      code: form.code,
      newPhone: form.newPhone,
      codeKey: form.codeKey,
    }
    updatePhone(submitData).then((value) => {
      loading.close()
      if (value) {
        Toast.success('修改手机号成功')
        router.push('/settings')
      }
    })
  }
  const cancel = () => {
    showDialog.value = false
  }
  // 校验手机号
  const checkPhone = () => {
    if (Check.phoneReg.test(form.oldPhone)) {
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
  .newPassword {
    display: flex;
    align-items: center;
    justify-content: center;
    input {
      border: none;
      border-bottom: 1px solid grey;
      font-size: 18px;
      width: 150px;
      height: 40px;
      text-align: center;
    }
  }
</style>
