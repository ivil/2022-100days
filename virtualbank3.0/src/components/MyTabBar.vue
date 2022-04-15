<template>
  <van-tabbar class="tabbar" v-model="active" active-color="#198cff" inactive-color="#000" route>
    <van-tabbar-item replace to="/" icon="home-o">
      <span>主页</span>
      <template v-slot:icon>
        <i :class="icon.shouye" style="font-size: 22px"></i>
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/FundIndex">
      基金
      <template v-slot:icon>
        <van-icon name="cash-o" />
      </template>
    </van-tabbar-item>
    <van-tabbar-item replace to="/about"
      >生活 <template v-slot:icon> <van-icon name="shop-collect-o" /> </template
    ></van-tabbar-item>
    <van-tabbar-item replace to="/mine">
      <span>我的</span>
      <template v-slot:icon>
        <i :class="icon.mine" style="font-size: 22px"></i>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script lang="ts">
  import { ref, defineComponent } from 'vue'
  import '../assets/icon/font_0hl763xb5cpq/iconfont.css'
  import '../assets/icon/font_3266379_p62bc0ylkyg/iconfont.css'

  export default defineComponent({
    name: 'MyTabBar',
    setup() {
      const active = ref(0)
      const icon = {
        shouye: 'iconfont icon-shouye',
        mine: 'iconfont icon-wode',
      }
      return { active, icon }
    },
  })
</script>

<style scoped>
  /deep/.van-tabbar-item--active,
  .tabbar {
    /*background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);*/
    z-index: 99;
  }
</style>
