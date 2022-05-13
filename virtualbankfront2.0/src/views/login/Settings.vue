<template>
  <div id="settings">
    <acc-navigation :title="title" />
    <div class="main">
      <ul class="password">
        <li v-for="list in lists" :key="list.id" @click="modify(list)">
          <ul class="ulStyle">
            <li>{{ list.name }}</li>
            <li><i class="iconfont learnMore">&#xe75e;</i></li>
          </ul>
        </li>
      </ul>
      <ul class="theme ulStyle">
        <li>更换皮肤</li>
        <li><i class="iconfont learnMore">&#xe75e;</i></li>
      </ul>

      <ul class="password">
        <li v-for="arr in arrs" :key="arr.id" @click="modify1(arr)">
          <ul class="ulStyle">
            <li>{{ arr.name }}</li>
            <li><i class="iconfont learnMore">&#xe75e;</i></li>
          </ul>
        </li>
      </ul>
      <ul class="theme logout" @click="logout">
        <li>退出登录</li>
      </ul>
    </div>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
export default {
  name: "Settings",
  components: {
    AccNavigation,
  },
  data() {
    return {
      title: "设置",
      lists: [
        { name: "修改登录密码", path: "/modifySignPass" },
        { name: "修改支付密码", path: "/modifyPayPass" },
      ],
      arrs: [
        // { name: "解绑卡", path: "/unBindCard" },
        { name: "注销账号", path: "/cancellation" },
      ],
    };
  },
  methods: {
    // 返回上一步
    back() {
      this.$router.go(-1);
    },
    // 点击列表，跳转到不同的页面
    modify(list) {
      console.log(list.path);
      this.$router.push(list.path);
    },
    // 点击列表，跳转到不同的页面
    modify1(arr) {
      console.log(arr.path);
      this.$router.push(arr.path);
    },
    // 点击退出登录
    logout() {
      this.$confirm("是否退出登录？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          this.$router.replace({
            path: "/logout",
            query: {
              username: JSON.parse(sessionStorage.getItem("user")).username,
            },
          });
          sessionStorage.clear();
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
#settings {
  background: #f5f5f5;
  width: 100%;
  height: 100%;
  position: fixed;
  .ulStyle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 12px;
  }
  .main {
    margin-top: 20px;
    .learnMore {
      font-size: 15px;
      color: #999;
    }
    .password {
      background: #fff;
      li {
        border-bottom: 1px solid #eaeaea;
        ul {
          margin-top: 10px;
          li {
            border: none;
          }
        }
      }
    }
    .theme {
      margin-top: 10px;
      background: #fff;
    }
    .logout {
      width: 100%;
      height: 50px;
      line-height: 50px;
      margin: 10px auto;
    }
  }
}
@font-face {
  font-family: "iconfont"; /* Project id 3184220 */
  src: url("//at.alicdn.com/t/font_3184220_54zjcig078o.woff2?t=1645155582274")
      format("woff2"),
    url("//at.alicdn.com/t/font_3184220_54zjcig078o.woff?t=1645155582274")
      format("woff"),
    url("//at.alicdn.com/t/font_3184220_54zjcig078o.ttf?t=1645155582274")
      format("truetype");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 20px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
<style>
/* messageBox弹框的样式 */
.el-message-box {
  width: 340px !important;
}
.el-button--primary {
  background-color: #5684ff !important;
  border-color: #5684ff !important;
}
</style>