<template>
  <div class="balanceQuery">
    <div class="nav">
      <acc-navigation :title="title" />
      <ul class="headerMenu">
        <li @click="which = 0"><h3>借记账户</h3></li>
        <li @click="which = 1"><h3>信用卡</h3></li>
        <li @click="which = 2"><h3>他行账户</h3></li>
        <li @click="which = 3"><h3>亲友号</h3></li>
      </ul>
    </div>

    <div class="mainContent">
      <template v-if="which === 0">
        <div class="card" v-for="(item, index) in debitAccounts" :key="index">
          <div class="aside">
            <img src="../../assets/card/bilibiliCard.png" alt="银行卡封面" />
            <p @click="toRecord">
              <i class="el-icon-folder-remove"></i>查看详情
            </p>
          </div>
          <div class="main">
            <ul>
              <li>卡号:{{ item.cardID }}</li>
              <li>
                <p>
                  <i class="el-icon-edit-outline"></i>卡名:{{ item.cardName }}
                </p>
                <p @click="lookCard(item)"><i :class="lock"></i>查看全卡号</p>
              </li>
              <li>
                可用余额:<i style="color: orange">{{ item.balance }}</i> 元
              </li>
            </ul>
          </div>
          <div class="menu">
            <ul>
              <li>查明细</li>
              <li>去转账</li>
              <li>买理财</li>
              <li @click="unbindCard(item,index)">去解绑</li>
            </ul>
          </div>
        </div>
      </template>

      <template v-else-if="which === 1">
        <div>
          <h3>您名下尚无信用卡</h3>
        </div>
      </template>

      <template v-else-if="which === 2">
        <div>
          <br />
          <h3>您尚未签约他行账户</h3>
        </div>
      </template>

      <template v-else-if="which === 3">
        <div>
          <br />
          <h3>您名下尚无受托管理的亲友账户记录</h3>
        </div>
      </template>
    </div>
    <button class="btn" @click="$router.push('/bindcard')">+添加新卡片</button>
  </div>
</template>

<script>
import { getAccountList, relieveCard } from "../../api/api";
import { encrypt } from "../../utils/AES";
import AccNavigation from "../../components/AccNavigation.vue";
import { Toast } from 'vant';
export default {
  name: "BalanceQuery",
  components: {
    AccNavigation,
  },
  data() {
    return {
      title: "我的账户",
      which: 0,
      accountId: 7,
      lock: "el-icon-lock",
      unlock: "el-icon-unlock",
      debitAccounts: [],
      creditAccounts: [],
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    toRecord() {
      this.$router.push("/record");
    },
    // 查看卡号
    lookCard(item) {
      let icon = this.lock;
      this.lock = this.unlock;
      this.unlock = icon;
      let temp = item.cardID;
      item.cardID = item.trueID;
      item.trueID = temp;
    },
    // 解绑卡
    unbindCard(item,index) {
      // 弹框提示：解绑卡成功
      this.$confirm("确定解绑吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(() => {
          // 支付密码弹框
          this.$prompt("请输入支付密码", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            inputType: "password",
          })
            .then(({ value }) => {
              console.log(value);
              // 发送axios请求
              let data = {
                userId: JSON.parse(sessionStorage.getItem("user")).userId,
                accountId: item.cardID.length > 14 ? item.cardID : item.trueID,
                payPassword: encrypt(value),
              };
              relieveCard(data).then((value) => {
                console.log(value);
                if (value.code === 200) {
                  // 将银行卡从数组中删除
                  this.debitAccounts.splice(index,1)
                  //提示解绑卡成功
                  Toast.success(value.message);
                } else if (value.code === 500) {
                  Toast.fail(value.message);
                }
              });
            })
            .catch(() => {
              console.log("支付失败");
            });
        })
        .catch(() => {});
    },
  },
  watch: {
    which(newV, oldV) {
      let newEl = document.querySelectorAll(".headerMenu li h3")[newV];
      let oldEl = document.querySelectorAll(".headerMenu li h3")[oldV];
      oldEl.style.color = "";
      newEl.style.color = "rgb(183, 48, 224)";
      let btn = document.querySelector(".btn");
      if (newV === 2 || newV === 3) {
        btn.style.display = "none";
      } else {
        btn.style.display = "block";
      }
    },
  },
  mounted() {
    // 初始化导航栏菜单按钮
    let temp = document.querySelectorAll(".headerMenu li h3")[this.which];
    temp.style.color = "rgb(183, 48, 224)";
  },
  created() {
    // 请求数据
    getAccountList().then(
      (value) => {
        if (value.code === 200) {
          // 将所有卡的信息存入vuex中
          this.$store.commit("getcardList", value.data);

          console.log(value.data);
          let cardList = value.data;
          this.debitAccounts = [];
          this.creditAccounts = [];
          sessionStorage.setItem("cardList", JSON.stringify(cardList));

          // 从vuex中获取卡的信息
          this.$store.state.cardList.forEach((el) => {
            if (el.type === "1") {
              let tempID =
                el.accountId.substring(0, 4) +
                " **** " +
                el.accountId.substring(el.accountId.length - 4);  
              let temp = {
                cardID: tempID,
                trueID: el.accountId,
                cardName: el.bankName,
                balance: el.money,
              };
              this.debitAccounts.push(temp);
            }
          });
        }
      },
      (reason) => {
        console.log(reason);
      }
    );
  },
};
</script>

<style lang="less" scoped>
.balanceQuery {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  position: absolute;
}
i {
  color: rgb(183, 48, 224);
}

.headerMenu {
  li {
    h3 {
      display: inline-block;
      font-weight: 600;
      color: #999;
    }
  }
}

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 110px;
  ul {
    &:nth-child(1) {
      background-color: whitesmoke;
      width: 100vw;
      height: 50px;
      display: flex;
      justify-content: space-between;
      align-content: center;
      li {
        width: 50px;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        &:nth-child(2) {
          width: 50%;
        }
        img {
          height: 80%;
          width: 80%;
        }
      }
    }
    &:nth-child(2) {
      background-color: whitesmoke;
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 60px;
      width: 100vw;
    }
  }
}
.mainContent {
  position: fixed;
  top: 110px;
  bottom: 60px;
  right: 0;
  left: 0;
  overflow-y: auto;
}
.card {
  width: 94vw;
  height: 180px;
  margin: 10px auto;
  background-color: whitesmoke;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  // border: 2px solid pink;
  background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
}

.aside {
  float: left;
  width: 30%;
  height: 140px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 90%;
    height: 40%;
    border-radius: 10px;
    margin-bottom: 10px;
  }
}
.main {
  width: 100%;
  height: 140px;
  ul {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    li {
      height: 30px;
      width: 100%;
      margin-top: 10px;
      &:nth-child(2) {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
  }
}
.menu {
  height: 40px;
  width: 100%;
  bottom: 0;
  position: absolute;
  ul {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: rgb(183, 48, 224);
  }
}
.btn {
  position: fixed;
  bottom: 0;
  left: 2vw;
  right: 2vw;
  height: 60px;
  font-size: larger;
  color: rgb(183, 48, 224);
  border-color: rgb(183, 48, 224);
  background: #ebebeb;
  border-radius: 5px;
  border: none;
  font-weight: 700;
}
</style>

<style>
/* messageBox弹框的样式 */
.el-message-box {
  width: 340px !important;
  text-align: center;
}
.el-button--primary {
  background-color: #5684FF !important;
  border-color: #5684FF !important;
}
</style>