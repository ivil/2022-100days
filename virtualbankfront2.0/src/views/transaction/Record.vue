<template>
  <div class="record">
    <div class="header">
      <acc-navigation :title="title" />
      <div class="nav">
        <ul>
          <li>
            <el-date-picker
              v-model="date"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="查某一天"
            >
            </el-date-picker>
          </li>
          <li @click="which = 0"><h3>最近</h3></li>
          <li @click="which = 1"><h3>转账</h3></li>
          <li @click="which = 2"><h3>提现</h3></li>
          <li @click="which = 3"><h3>充值</h3></li>
        </ul>
      </div>
    </div>
    <div class="mainContent">
      <!-- 查询某一天的具体记录 -->
      <template v-if="which === 'ivil'">
        <div
          class="records"
          v-for="(item, index) in specificRecords"
          :key="index"
          @click="toDetail(index)"
        >
          <ul>
            <li>{{ item.name }}</li>
            <li style="color: red">{{ item.money }}元</li>
          </ul>
          <ul>
            <li style="color: green">{{ item.createTime }}</li>
            <li style="color: orange">{{ item.type }}</li>
          </ul>
        </div>
      </template>
      <!-- 查询最近记录 -->
      <template v-if="which === 0">
        <div
          class="records"
          v-for="(item, index) in recentRecords"
          :key="index"
          @click="toDetail(index)"
        >
          <ul>
            <li>{{ item.name }}</li>
            <li style="color: red">{{ item.money }}元</li>
          </ul>
          <ul>
            <li style="color: green">{{ item.createTime }}</li>
            <li style="color: orange">{{ item.type }}</li>
          </ul>
        </div>
      </template>
      <!-- 查询转账记录 -->
      <template v-if="which === 1">
        <div
          class="records"
          v-for="(item, index) in transferRecords"
          :key="index"
          @click="toDetail(index)"
        >
          <ul>
            <li>{{ item.name }}</li>
            <li style="color: red">{{ item.money }}元</li>
          </ul>
          <ul>
            <li style="color: green">{{ item.createTime }}</li>
            <li style="color: orange">{{ item.type }}</li>
          </ul>
        </div>
      </template>
      <!-- 查询提现记录 -->
      <template v-if="which === 2">
        <div
          class="records"
          v-for="(item, index) in withdrawRecords"
          :key="index"
          @click="toDetail(index)"
        >
          <ul>
            <li>{{ item.name }}</li>
            <li style="color: red">{{ item.money }}元</li>
          </ul>
          <ul>
            <li style="color: green">{{ item.createTime }}</li>
            <li style="color: orange">{{ item.type }}</li>
          </ul>
        </div>
      </template>
      <!-- 查询充值记录 -->
      <template v-if="which === 3">
        <div
          class="records"
          v-for="(item, index) in rechargeRecords"
          :key="index"
          @click="toDetail(index)"
        >
          <ul>
            <li>{{ item.name }}</li>
            <li style="color: red">{{ item.money }}元</li>
          </ul>
          <ul>
            <li style="color: green">{{ item.createTime }}</li>
            <li style="color: orange">{{ item.type }}</li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { record, getSpecificRecord } from "../../api/api";
export default {
  components: { AccNavigation },
  name: "Record",
  data() {
    return {
      title: "交易记录",
      which: 0,
      date: "",
      userId: "7",
      specificRecords: [
        {
          name: "xxl",
          money: "1212",
          createTime: "2021",
          type: "收入",
        },
      ],
      transferRecords: [],
      rechargeRecords: [],
      withdrawRecords: [],
      recentRecords: [
        {
          name: "xxl",
          money: "1212",
          createTime: "2021",
          type: "收入",
        },
      ],
    };
  },
  methods: {
    toDetail(index) {
      this.$router.push({
        path: "/details",
        query: {
          detailId: this.recentRecords[index].transferId,
        },
      });
    },
  },
  watch: {
    which(newV, oldV) {
      try {
        let oldEl = document.querySelectorAll(".nav ul li h3")[oldV];
        let newEl = document.querySelectorAll(".nav ul li h3")[newV];
        oldEl.style.color = "";
        newEl.style.color = "orange";
      } catch (e) {}
    },
    date(newV, oldV) {
      this.which = "ivil";
      this.specificRecords = [];
      getSpecificRecord(newV).then(
        (value) => {
          if (value.code === 200) {
            console.log(value.data);
            console.log(value.message);
            value.data.forEach((el) => {
              let temp = {
                name: el.state === "1" ? "交易成功" : "交易失败",
                money: el.money,
                createTime: el.createTime,
                transferId: el.id,
              };
              // 充值005，提现006，转账002，
              if (el.type === "0002") {
                temp.type = "转账";
              } else if (el.type === "0006") {
                temp.type = "提现";
              } else if (el.type === "0005") {
                temp.type = "充值";
              } else if (el.type === "0013") {
                console.log(el);
                temp.type = "支出";
              }
              this.specificRecords.push(temp);
            });
          } else {
            console.log(value.message);
          }
        },
        (reason) => {
          console.log(reason);
        }
      );
    },
  },
  mounted() {
    document.querySelectorAll(".nav ul li h3")[0].style.color = "orange";
  },
  created() {
    this.recentRecords = [];
    record().then(
      (value) => {
        console.log(value);
        sessionStorage.setItem("recordList", JSON.stringify(value.data));
        value.data.forEach((el) => {
          let temp = {
            name: el.state === "1" ? "交易成功" : "交易失败",
            money: el.money,
            createTime: el.createTime,
            transferId: el.id,
          };
          // 充值005，提现006，转账002，
          if (el.type === "0002") {
            temp.type = "转账";
            this.transferRecords.push(temp);
          } else if (el.type === "0006") {
            temp.type = "提现";
            this.withdrawRecords.push(temp);
          } else if (el.type === "0005") {
            temp.type = "充值";
            this.rechargeRecords.push(temp);
          } else if (el.type === "0013") {
            temp.type = "支出";
            this.transferRecords.push(temp);
          }
          this.recentRecords.push(temp);
        });
      },
      (reason) => {
        console.log(reason);
      }
    );
  },
};
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 110px;
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
}
.mainContent {
  position: fixed;
  top: 111px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: whitesmoke;
  overflow-y: auto;
}
.nav {
  ul {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 50px;
    width: 100vw;
    li {
      h3 {
        font-size: 22px;
        color: rgb(183, 48, 224);
        font-weight: 500;
      }
    }
  }
}
.records {
  width: 94vw;
  height: 70px;
  margin: 10px auto;
  // border-radius: 10px;
  // border-bottom: 1px solid rgb(183, 48, 224);
  border-bottom: 1px solid #999;
  background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50%;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      &:nth-child(1) {
        height: 100%;
        width: 70%;
      }
      &:nth-child(2) {
        height: 100%;
        width: 30%;
      }
    }
  }
}
/* 日期选择框的宽度 */
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 135px;
}
</style>