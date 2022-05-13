<template>
  <div id="information">
    <acc-navigation :title="title" />
    <div class="main">
      <!------ 头像 ------>
      <ul class="avatar">
        <li>头像</li>
        <li>
          <div class="img1" @click="changeAvatar">
            <img :src="avatar" alt="" />
            <div class="iconfont learnMore">&#xe75e;</div>
          </div>
        </li>
      </ul>
      <!------ 信息列表 ------>
      <ul class="lists">
        <li v-for="list in lists" :key="list.id">
          <ul>
            <li>{{ list.msg }}</li>
            <li>
              <div class="img1" @click.stop="changeList(list)">
                <p>{{ list.detail }}</p>
                <div class="iconfont learnMore">&#xe75e;</div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <!-------- 遮罩层 -------->
    <div class="mask" v-show="maskShow" @click="clickMask"></div>

    <!-------- 头像列表 -------->
    <div class="avatarList" v-show="avatarShow">
      <ul>
        <li v-for="item in arr" :key="item.id">
          <p>{{ item.name }}</p>
          <img :src="item.path" alt="" @click="choose(item)" />
        </li>
      </ul>
      <p @click="cancle">取消</p>
    </div>

    <!-------- 点击注册手机号时，弹出的提示信息 -------->
    <div class="phoneMessage" v-show="phoneShow">
      <h4>提示信息</h4>
      <p>
        修改注册手机号将同时修改银行认证手机号(认证手机号适用于电子银行、贷款、信用卡等业务)，
        修改后原手机号将不再使用，您使用过程中使用的短信验证码将发送到您的新手机号上，
        请注意保护好您的短信信息不被泄露，若修改前有账户将注册手机号签约为短信通知号码，
        则修改后该账户签约短信通知号码会同步更改为新注册手机号
      </p>
      <ul>
        <li @click="cancle">取消</li>
        <li>|</li>
        <li @click="modify">修改</li>
      </ul>
    </div>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { Toast } from "vant";
export default {
  name: "Information",
  components: {
    AccNavigation,
  },
  data() {
    return {
      title: "基本信息",
      avatar: require("@/assets/me/avatar1.jpg"), //默认头像
      maskShow: false,
      avatarShow: false,
      phoneShow: false,
      arr: [
        {
          name: "默认头像1",
          path: this.$store.state.pathMan,
        },
        {
          name: "默认头像2",
          path: this.$store.state.pathWoman,
        },
        {
          name: "默认头像3",
          path: this.$store.state.pathAvatar,
        },
      ],
      lists: [
        {
          id: 1,
          msg: "注册手机号",
          detail: "",
          path: "/passSign",
        },
        {
          id: 2,
          msg: "证件信息",
          detail: "",
        },
      ],
    };
  },
  mounted() {
    // 显示出头像
    try {
      let avatar = JSON.parse(window.localStorage.getItem("avatar")).avatar;
      if (window.localStorage.getItem("avatar")) {
        this.avatar = avatar;
      }
    } catch (e) {
      // console.log("T_T");
    }
    // 脱敏显示手机号
    let mobilePhone =
      JSON.parse(sessionStorage.getItem("user")).mobilePhone || "";
    this.lists[0].detail =
      mobilePhone.substring(0, 3) +
      "****" +
      mobilePhone.substring(mobilePhone.length - 4);
    // 脱敏显示姓名
    let username = JSON.parse(sessionStorage.getItem("user")).username || "";
    this.lists[1].detail = username.substring(0, 1);
    for (let i = 0; i < username.length - 1; i++) {
      this.lists[1].detail += "*";
    }
  },
  methods: {
    // 返回上一步
    back() {
      this.$router.go(-1);
    },
    // 点击头像，遮罩层显示，头像列表显示
    changeAvatar() {
      this.maskShow = true;
      this.avatarShow = true;
    },
    // 点击遮罩层，所有东西消失
    clickMask() {
      this.maskShow = false;
      this.avatarShow = false;
      this.phoneShow = false;
    },
    // 选择头像，遮罩层消失，头像列表消失
    choose(item) {
      this.avatar = item.path;
      this.maskShow = false;
      this.avatarShow = false;

      Toast.success('头像修改成功！');
      
      // 将头像路径存入缓存
      let accountId = JSON.parse(
        window.sessionStorage.getItem("user")
      ).accountId;
      let obj = JSON.stringify({ avatar: item.path, accountId: accountId });
      window.localStorage.setItem("avatar", obj);
    },
    // 点击取消时
    cancle() {
      this.maskShow = false;
      this.phoneShow = false;
      this.avatarShow = false;
    },
    // 点击对应的信息列表时，弹出提示或跳转到不同的页面
    changeList(list) {
      if (list.id === 1) {
        this.maskShow = true;
        this.phoneShow = true;
      }
    },
    // 修改手机号，跳转到修改手机号页面
    modify() {
      this.$router.push("/modifyPhone");
    },
  },
};
</script>

<style lang="less" scoped>
#information {
  background: #f5f5f5;
  width: 100%;
  height: 100%;
  position: fixed;
  img {
    width: 55px;
    border-radius: 50%;
    margin: 0px 15px;
  }
  // 创建混合集，flex布局居中
  .center() {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .center1() {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  // 创建混合集，留出左右空余位置，设置背景色
  .margin() {
    padding: 18px 12px;
    background: #fff;
  }
  .main {
    .learnMore {
      font-size: 16px;
    }
    .img1 {
      .center();
      p {
        margin-right: 10px;
      }
      div {
        color: #aaa;
      }
    }
    .avatar {
      .center1();
      .margin();
      margin-top: 20px;
    }
    .lists {
      margin-top: 10px;
      li {
        ul {
          .center1();
          .margin();
          border-bottom: 1px solid #ececec;
        }
      }
    }
  }
  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0px;
    left: 0px;
  }
  .avatarList {
    width: 100%;
    height: 200px;
    background-color: #ffffff;
    position: fixed;
    bottom: 0px;
    left: 0px;
    // 头像列表弹出来的动画
    animation: window-open 0.5s ease;
    @keyframes window-open {
      0% {
        bottom: -50px;
      }
      100% {
        bottom: 0;
      }
    }
    ul {
      .center();
      padding: 20px 0px;
      border-bottom: 1px solid #d6d6d6;
      p {
        padding: 0px 0px 20px 0px;
        color: #666;
      }
    }
    p {
      padding: 20px 0px;
      color: rgb(231, 14, 14);
    }
  }
  .phoneMessage {
    width: 70%;
    height: 350px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    background: #fff;
    h4 {
      padding-top: 15px;
    }
    p {
      text-align: left;
      padding: 15px;
      border-bottom: 1px solid #dfdfdf;
    }
    ul {
      .center();
      .margin();
      li {
        &:last-child {
          color: rgb(231, 14, 14);
        }
        &:nth-child(2) {
          color: #bbb;
        }
      }
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