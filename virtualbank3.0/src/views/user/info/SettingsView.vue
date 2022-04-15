<template>
  <div class="header">
    <Navigation :title="title" />
  </div>
  <div class="body">
    <br />
    <van-cell title="修改绑定手机号" cleakable is-link @click="router.push('/updatePhone')" />
    <br />
    <van-cell title="修改登录密码" cleakable is-link @click="router.push('/updatePassword')" />
    <br />
    <van-cell title="修改支付密码" cleakable is-link @click="router.push('/updatePayPassword')" />
    <br />
    <!-- <van-cell title="更换皮肤" cleakable is-link @click="router.push('/')" />
    <br /> -->
    <van-cell title="注销账号" cleakable is-link @click="toLogout" />
    <br />
    <br />
    <van-button class="button" type="primary" plain @click="toSignout">退出登录</van-button>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { Dialog, Toast } from 'vant'
  import Navigation from '@/components/Navigation.vue'
  import router from '@/router'
  import { sigout } from '@/axios/business/user.api'

  const title = ref('设置')
  const toLogout = () => {
    Dialog.confirm({
      message: '是否前往注销页面？',
    })
      .then(() => {
        router.push('/logout')
      })
      .catch(() => {})
  }

  const toSignout = () => {
    Dialog.confirm({
      message: '您确定要退出登录吗',
    })
      .then(() => {
        sigout().then((value) => {
          if (value) {
            localStorage.setItem('token', '')
            Toast.success('退出登录成功')
            router.replace('/loginByPhone')
          }
        })
      })
      .catch(() => {})
  }
</script>

<style lang="less" scoped>
  .header {
    overflow: hidden;
  }
  .body {
    padding-left: 5px;
    padding-right: 5px;
    .button {
      width: 94%;
      margin-left: 3%;
    }
  }
</style>
