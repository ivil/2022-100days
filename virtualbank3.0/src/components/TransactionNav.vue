<template>
  <div class="nav">
    <span>
      <van-icon @click="goBack" name="arrow-left" />
    </span>
    <span>{{ title }}</span>
    <span>
      <div id="lottie" @click="toHelp"></div>
    </span>
  </div>
</template>

<script lang="ts">
import { Dialog } from 'vant'
  import { defineComponent, onMounted } from 'vue'
  import lottie from 'lottie-web'
  import router from '@/router/index'
  import data from '@/lottie.json/102117.json'

  export default defineComponent({
    name: 'TransactionNav',
    props: {
      title: String,
    },
    setup() {
      const goBack = () => {
        router.go(-1)
      }
      const toHelp = () => {
        Dialog.confirm({
          allowHtml: true,
          message: `是否前往主页？`,
        }).then(() => {
          router.push('/')
        }).catch(()=>{})
      }
      onMounted(() => {
        lottie.loadAnimation({
          container: document.querySelector('#lottie') as HTMLElement, // the dom element that will contain the animation
          renderer: 'svg', // render svg |  canvas
          loop: true,
          autoplay: true,
          animationData: data,
        })
      })
      return {
        goBack,
        toHelp,
      }
    },
  })
</script>

<style lang="less" scoped>
  #lottie {
    width: 100px;
    height: 100px;
  }
  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
    height: 50px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    font-size: 20px;
    padding-left: 10px;
    // padding-right: 10px;
    span {
      img {
        height: 30px;
        width: 30px;
      }
    }
  }
</style>
