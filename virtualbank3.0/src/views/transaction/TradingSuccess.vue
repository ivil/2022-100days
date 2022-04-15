<template>
  <div class="container"></div>
</template>

<script setup>
  import lottie from 'lottie-web'
  import { defineComponent, onMounted } from 'vue'
  import data from '@/lottie.json/trading-success.json'

  onMounted(() => {
    lottie.loadAnimation({
      container: document.querySelector('.container'), // the dom element that will contain the animation
      renderer: 'svg', // render svg |  canvas
      loop: true,
      autoplay: true,
      animationData: data,
    })
  })
</script>

<style lang="less" scoped></style>
