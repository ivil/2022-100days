<template>
  <div class="weather">
    <div id="he-plugin-simple"></div>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue'

  window.WIDGET = {
    CONFIG: {
      modules: '01234',
      background: '5',
      tmpColor: '#ffffff',
      tmpSize: '16',
      cityColor: '000000',
      citySize: '18',
      aqiColor: '#ffffff',
      aqiSize: '16',
      weatherIconSize: '24',
      alertIconSize: '18',
      padding: '0px 0px 0px 0px',
      shadow: '0',
      language: 'auto',
      fixed: 'false',
      vertical: 'center',
      horizontal: 'center',
      key: 'e71692b6df9e43bdad5f1bfd62fb0466',
    },
  }
  const weather = () => {
    const s = document.createElement('script')
    s.type = 'text/javascript'
    s.src = 'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0'
    document.body.appendChild(s)
  }
  onMounted(() => {
    weather()
  })
</script>

<style lang="less" scoped>
  .weather {
    height: 50px;
    width: 50%;
    margin-top: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .s-sticker div {
    color: white;
  }
</style>
