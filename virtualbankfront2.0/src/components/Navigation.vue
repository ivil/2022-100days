<template>
  <div id="navigation">
    <ul>
      <li>
        <router-link to="/">
          <i class="el-icon-s-home"></i>
          <p>首页</p>
        </router-link>
      </li> 
      <li>
        <router-link to="/finance">
          <i class="el-icon-s-marketing"></i>
          <p>财富</p>
        </router-link>
      </li>
      <li>
        <router-link to="/me">
          <i class="el-icon-user-solid"></i>
          <p>我的</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Navigation",
};
</script>

<style scoped lang="less">
ul {
  z-index: 1000;
  width: 100%;
  position: fixed;
  bottom: 0px;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: space-around;
  background:#fff;
  // margin-bottom: 50px;
  li {
    height: 46px; 
    float: left;
    padding-top: 2px;
    a {
      color: #666;
      &.router-link-exact-active {
        color: #5684ff;
      }
      p {
        margin-top: 2px;
      }
    }
    i {
      font-size: 22px;
    }
  }
}
</style>