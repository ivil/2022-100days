<template>
  <router-view></router-view>
  <MyTabBar></MyTabBar>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import MyTabBar from '@/components/MyTabBar.vue'

  export default defineComponent({
    name: 'MainIndex',
    components: { MyTabBar },
  })
</script>
<style scoped></style>
