<template>
  <div class="notFound"></div>
  <div class="choose">
    <p>找不到页面了哟!!</p>
    <p @click="toHome">确定</p>
  </div>
</template>

<script lang="ts" setup>
  import lottie from 'lottie-web'
  import { onMounted } from 'vue'
  import data from '../lottie.json/notFound.json'
  import router from '../router/index'

  onMounted(() => {
    lottie.loadAnimation({
      container: document.querySelector('.notFound') as HTMLElement, // the dom element that will contain the animation
      renderer: 'svg', // render svg |  canvas
      loop: true,
      autoplay: true,
      animationData: data,
    })
  })
  const toHome = () => {
    router.replace('/')
  }
</script>

<style lang="less" scoped>
  .choose {
    p {
      font-size: 20px;
      color: lightseagreen;
      text-align: center;
      &:nth-child(2) {
        width: 100px;
        height: 40px;
        background-image: linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%);
        margin: 10px auto;
        line-height: 40px;
        border-radius: 5px;
      }
    }
  }
</style>
