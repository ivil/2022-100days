<template>
  <div class="Transfer2">
    <acc-navigation :title="title" />

    <div class="message">
      <div class="top">
        <!-- <p>{{ money | formatMoney }}</p> -->
        <p>{{ money | formatMoney }}</p>
      </div>
      <p style="color: #999">本次减免手续费2.00元,实收手续费0.00元</p>
      <div class="name">
        <ul>
          <li>
            <p>转账人</p>
            <p>借记卡(尾号:6208)</p>
          </li>
          <li><i class="el-icon-right"></i></li>
          <li>
            <p>{{name}}</p>
            <p>{{get}}</p>
          </li>
        </ul>
      </div>
      <div class="way">
        <p>用途</p>
        <p>转账</p>
      </div>
    </div>

    <div class="next" @click="toggle">确认</div>

  <!-- 密码框 -->
  <transition name="fade" mode="out-in">
  <password v-show="isFalse" @show="toggle(data)"></password>
  </transition>
  </div>
</template>

<script>
import Password from '../../components/Password.vue';
import AccNavigation from "../../components/AccNavigation.vue";
export default {
  components: { AccNavigation,Password },
  name: "Transfer2",
  data() {
    return {
      title:"转账汇款",
      // 获取缓存
      money: parseFloat(JSON.parse(window.sessionStorage.getItem("msg")).money), //JSON.parse(window.sessionStorage.getItem("msg")).money,
      name: JSON.parse(window.sessionStorage.getItem("msg")).user,
      get: JSON.parse(window.sessionStorage.getItem("msg")).get,

      isFalse:false,
    };

  },
  //局部过滤器
  // filters: {
  //   formatMoney(value) {
  //     return "￥" + value.toFixed(2);
  //   },
  // },

  methods: {
    // 点击确认按钮
    toggle(data){
      this.isFalse = !this.isFalse;
      console.log(this.data);
      // this.show = true;
      this.data = !this.data;
    },

  // 返回
  back(){
    this.$router.go(-1);
  },

  },

};
</script>

<style lang="less" scoped>
@box-shadow: 0px 6px 12px #999;
@border-bottom: 1px solid #999;
// 过渡效果
.fade-enter-active, .fade-leave-active {
  transition: all 0.9s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}

.p {
  font-size: 18px;
  line-height: 40px;
  letter-spacing: 5px;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.Transfer2 {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  position: fixed;
}
.message {
  width: 350px;
  // height: 330px;
  height: auto;
  background: #fff;
  margin: 40px auto;
}
.top {
  width: 100%;
  height: 80px;
  p {
    line-height: 80px;
    font-size: 32px;
  }
}
.name {
  width: 100%;
  height: 60px;
  margin-top: 20px;
  ul {
    width: 100%;
    display: flex;
    justify-content: space-around;
    li {
      width: 120px;
      height: 60px;
      &:nth-of-type(2) {
        width: 50px;
        line-height: 60px;
        font-size: 18px;
      }
      p {
        font-size: 16px;
        margin: 10px 0;
        &:nth-child(2) {
          font-size: 12px;
        }
      }
    }
  }
}

.way {
  width: 100%;
  height: 50px;
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  p {
    line-height: 50px;
    font-size: 18px;
    letter-spacing: 3px;
  }
}
.next {
  width: 340px;
  height: 50px;
  background: rgb(183, 48, 224);
  border-radius: 5px;
  margin: 0px auto;
  font-size: 22px;
  color: #fff;
  letter-spacing: 5px;
  line-height: 50px;
}

</style>
