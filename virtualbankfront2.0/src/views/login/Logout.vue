<template>
  <div class="logout">
    <acc-navigation :title="title" />
    <div class="middle">
      <div class="nav">
        <img :src="avatar" alt="" />
        <p>退出成功</p>
      </div>
      <p>
        尊敬的{{
          username
        }},您已安全退出手机银行。<br />感谢您使用中国雄鸡银行手机银行
      </p>
    </div>
    <div class="footer">
      <p @click="back">返回首页</p>
      <p @click="loginAgain">重新登录</p>
    </div>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
export default {
  name: "logout",
  components: {
    AccNavigation,
  },
  data() {
    return {
      title: "欢送页",
      avatar: require("@/assets/me/avatar1.jpg"),
      username: "用户",
    };
  },
  methods: {
    back() {
      this.$router.replace({ name: "Index" });
    },
    loginAgain() {
      this.$router.push("/passSign");
    },
  },
  mounted() {
    try {
      this.avatar = JSON.parse(localStorage.getItem("avatar")).avatar || null;
    } catch (e) {}

    try {
      if (this.$route.query.username == null) {
        this.username = "用户";
      } else {
        this.username = this.$route.query.username;
      }
    } catch (e) {}
  },
};
</script>

<style lang="less" scoped>
@width: 360px;
.width {
  width: 360px;
  margin: 0 auto;
}
.middle {
  width: 360px;
  height: 200px;
  margin: 50px auto 20px;
  border-top: 1px solid #999;
  border-bottom: 1px solid #999;
  p {
    margin-top: 20px;
    line-height: 25px;
    font-size: 18px;
    color: green;
  }
}
.nav {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 80px;
    height: 80px;
    background: lightcoral;
    border-radius: 50%;
  }
  p {
    font-size: 20px;
    margin: 0 10px;
    letter-spacing: 3px;
    color: green;
  }
}

.radio {
  .width();
  height: 30px;
  display: flex;
  align-items: center;
  input {
    width: 16px;
    height: 16px;
    margin: 10px;
  }
  span {
    letter-spacing: 2px;
  }
}

.footer {
  .width();
  height: 120px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  p {
    width: 100%;
    height: 50px;
    background: #5684ff;
    margin-bottom: 5px;
    border-radius: 5px;
    line-height: 50px;
    font-size: 18px;
    letter-spacing: 3px;
    color: #fff;
    &:nth-child(2) {
      background: #fff;
      border: 1px solid #5684ff;
      width: 358px;
      height: 48px;
      line-height: 48px;
      color: #5684ff;
    }
  }
}
</style>