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
      <van-col span="3" offset="0"><van-icon name="manager-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input @keyup="checkName" v-model="form.name" placeholder="请输入姓名" class="input" type="text"
      /></van-col>
      <van-col span="4"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.name }}</div>
    <br />
    <van-row justify="center">
      <van-col span="3" offset="0"><van-icon name="bulb-o" color="#198cff" size="22" /></van-col>
      <van-col span="14"
        ><input @keyup="checkID" v-model="form.ID" placeholder="请输入身份证号" class="input" type="text"
      /></van-col>
      <van-col span="4"><span></span></van-col>
    </van-row>
    <div class="error">{{ errors.ID }}</div>
    <br />
    <van-row jutify="center">
      <van-button class="button" plain type="primary" @click="next">下一步</van-button>
    </van-row>
  </div>
  <van-overlay :show="showDialog">
    <van-dialog
      :show="true"
      title="请设置支付密码"
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
  import { Dialog, Notify, Toast } from 'vant'
  import { useStore } from 'vuex'
  import Navigation from '@/components/Navigation.vue'
  import { openAccount } from '@/axios/business/user.api'
  import router from '@/router'
  import { Check } from '@/utils/Check'
  import { getBankCardList } from '@/axios/business/transaction.api'

  const store = useStore()
  const title = ref('开户')
  const showDialog = ref(false)
  const errors = reactive({
    name: '',
    ID: '',
  })
  // 表单
  const form = reactive({
    name: '',
    ID: '',
    payPassword: '',
  })
  // 下一步
  const next = () => {
    checkName()
    checkID()
    if (!(errors.name || errors.ID)) {
      showDialog.value = true
    } else {
      Notify({
        type: 'danger',
        message: '请检查输入！',
      })
    }
  }
  // 表单提交
  const submit = () => {
    const reg = /\d{6}/
    if (!reg.test(form.payPassword)) {
      Notify({
        type: 'warning',
        message: '支付密码只能为6位纯数字',
      })
    } else {
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
        name: form.name,
        idNumber: form.ID,
        cardPassword: form.payPassword,
      }
      openAccount(submitData).then((value) => {
        loading.close()
        if (value) {
          // 将开户状态设为true
          store.commit('setStatusOfOA', true)
          Dialog.confirm({
            message: '开户已成功，是否前往绑卡?',
          })
            .then(() => {
              router.push('/bindCard')
            })
            .catch(() => {})
        }
      })
    }
  }
  // 取消
  const cancel = () => {
    showDialog.value = false
    form.payPassword = ''
  }

  // 校验姓名
  const checkName = () => {
    if (form.name != '') {
      errors.name = ''
    } else {
      errors.name = '请输入姓名！'
    }
  }
  // 校验身份证号
  const checkID = () => {
    if (Check.IDReg.test(form.ID)) {
      errors.ID = ''
    } else {
      errors.ID = '身份证号格式不正确！'
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
