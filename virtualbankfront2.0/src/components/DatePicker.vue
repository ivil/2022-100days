<template>
  <div class="datePicker" :style="{ display: display }">
    <div class="top">
      <ul>
        <li><i class="el-icon-close"></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h3>选择月份</h3></li>
        <li><h3>自定义</h3></li>
      </ul>
    </div>
    <div class="main">
        <ul>
            <li><div>2022</div></li>
            <li><div>7月</div></li>
        </ul>
    </div>
    <div class="bottem">
      <button><h3>确 &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;定</h3></button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DatePicker",
  props: {
    isShow: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  computed: {
    display() {
      return this.isShow ? "block" : "none";
    },
  },
};
</script>

<style lang="less" scoped>
.datePicker {
  position: fixed;
  background-color: whitesmoke;
  bottom: 0;
  left: 0;
  right: 0;
  height: 300px;
}
.top {
  height: 50px;
  width: 100%;
  background-color: gainsboro;
  ul {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    li {
      height: 100%;
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.main {
  height: calc(100% - 110px);
  width: 100%;
  display: flex;
  align-items: center;
  ul{
      width: 100%;
      height: 50px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: larger;
      li{
          height: 100%;
          div{
              width: 100px;
              height: 100%;
              margin-left: 30px;
          }
      }
  }
}
.bottem {
  height: 60px;
  width: 100%;
  button {
    width: 94vw;
    height: 50px;
    border-radius: 10px;
    border-color: #5684ff;
    margin-left: auto;
    margin-right: auto;
    font-size: large;
  }
}
</style>