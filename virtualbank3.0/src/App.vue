<template>
  <router-view />
</template>
<script lang="ts">
  import { defineComponent } from 'vue'

  export default defineComponent({
    components: {},
  })
</script>

<style scoped lang="less">
  #app {
    color: #2c3e50;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
  }

  nav {
    padding: 30px;
    a {
      color: #2c3e50;
      font-weight: bold;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
