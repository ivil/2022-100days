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
        ><input v-model="form.oldPassword" placeholder="请输入旧密码" class="input" type="password"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.oldPassword }}</div>
    <br />
    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="fire-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input
          @keyup="checkPassword"
          v-model="form.newPassword"
          placeholder="请输入新密码"
          class="input"
          type="password"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.newPassword }}</div>
    <br />
    <van-row justify="center">
      <van-col span="2" offset="1"><van-icon name="fire-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input
          @keyup="checkPasswordAgain"
          v-model="form.checkNewPassword"
          placeholder="请确认新密码"
          class="input"
          type="password"
      /></van-col>
      <van-col span="6"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.checkNewPassword }}</div>
    <van-row jutify="center">
      <van-button class="button" plain type="primary" @click="submit">下一步</van-button>
    </van-row>
    <br />
    <br />
  </div>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import { Toast } from 'vant'
  import { useRouter } from 'vue-router'
  import Navigation from '@/components/Navigation.vue'
  import { updatePassword } from '@/axios/business/user.api'
  import { Check } from '@/utils/Check'

  const router = useRouter()
  const title = ref('修改登录密码')
  const errors = reactive({
    oldPassword: '',
    newPassword: '',
    checkNewPassword: '',
  })
  const form = reactive({
    oldPassword: '',
    newPassword: '',
    checkNewPassword: '',
  })

  // 提交
  const submit = () => {
    if (form.oldPassword == '') {
      errors.oldPassword = '请输入原密码！'
      return
    }
    errors.oldPassword = ''

    checkPassword()
    checkPasswordAgain()
    if (errors.newPassword || errors.checkNewPassword) {
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
      oldLoginPassword: form.oldPassword,
      newLoginPassword: form.newPassword,
    }
    updatePassword(submitData).then((value) => {
      loading.close()
      if (value) {
        Toast.success('修改密码成功')
        router.push('/settings')
      }
    })
  }
  // 校验新密码
  const checkPassword = () => {
    if (Check.passwordReg.test(form.newPassword)) {
      errors.newPassword = ''
    } else {
      errors.newPassword = '密码长度至少为8，且至少含有一个字母和数字！'
    }
  }
  // 校验二次密码
  const checkPasswordAgain = () => {
    if (form.checkNewPassword === form.newPassword) {
      errors.checkNewPassword = ''
    } else {
      errors.checkNewPassword = '两次密码不一致！'
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
