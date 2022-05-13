<template>
  <div class="keyboard">
    <div class="key">
      <ul>
        <div class="left">
          <ul>
            <li>
              <p>1</p>
              <p>2</p>
              <p>3</p>
            </li>
            <li>
              <p>4</p>
              <p>5</p>
              <p>6</p>
            </li>
            <li>
              <p>7</p>
              <p>8</p>
              <p>9</p>
            </li>
            <li>
              <p style="width: 166px">0</p>
              <p>.</p>
            </li>
          </ul>
        </div>
        <div class="right">
          <ul>
            <li>
              <p>X</p>
            </li>
            <li>
              <p></p>
            </li>
          </ul>
        </div>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "keyboard",
  data() {
    return {};
  },
  methods: {
    submitForm() {},
  },
};
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.key {
  width: 100%;
  height: 270px;
  background: #faf4f4;
  position: absolute;
  bottom: 0;
    // 键盘升起特效
  animation: window-open 0.5s ease;
  @keyframes window-open {
    0% {
      bottom: -50px;
    }
    100% {
      bottom: 0;
    }
  }
}
.left {
  width: 75%;
  height: 210px;
  float: left;
  ul {
    width: 100%;
    li {
      width: 100%;
      height: 60px;
      margin-top: 10px;
      line-height: 60px;
      .flex();
      p {
        width: 83px;
        height: 60px;
        background: #fff;
        color: #000;
        font-size: 28px;
        // font-weight: 800;
      }
    }
  }
}
.right {
  width: 25%;
  height: 210px;
  float: right;
  ul {
    width: 100%;
    li {
      height: 60px;
      margin-top: 10px;
      line-height: 60px;
      p {
        width: 83px;
        height: 60px;
        background: #fff;
        font-size: 24px;
      }
      &:nth-of-type(2) {
        height: 130px;
        p {
          height: 130px;
          color: #fff;
          line-height: 130px;
          // background: rgb(211, 124, 238);
          border-radius: 5px;
        }
      }
    }
  }
}
</style>