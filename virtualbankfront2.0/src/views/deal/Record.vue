<template>
  <div>
    <DealNav :title="title" />
    <div class="record">
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
      <div class="main">
        <!-- 查询某一天的具体记录 -->
        <template v-if="which === 'ivil'">
          <div
            class="records1"
            v-for="(item, index) in specificRecords"
            :key="index"
            @click="toDetail(item.transferId)"
          >
            <ul>
              <li>
                <template v-if="item.type === '支出'">
                  <h3 style="color: red">{{ item.type }}</h3>
                  <h3 style="color: red">{{ item.money }}</h3>
                </template>
                <template v-if="item.type === '收入'">
                  <h3 style="color: #23c3bd">{{ item.type }}</h3>
                  <h3 style="color: #23c3bd">{{ item.money }}</h3>
                </template>
                <template v-if="item.type === '提现' || item.type === '充值'">
                  <h3>{{ item.type }}</h3>
                  <h3>{{ item.money }}</h3>
                </template>
              </li>

              <li>交易时间：{{ item.createTime }}</li>
              <li>
                交易流水号：{{ item.transferId }}
                <p>{{ item.name }}</p>
              </li>
              <li>
                <template v-if="item.type === '收入'||item.type === '支出'">
                  <p>交易对象：{{ item.username }}</p>
                </template>
                <template v-else>
                  <p>网上支付</p>
                </template>
              </li>
            </ul>
          </div>
        </template>
        <!-- 查询最近记录 -->
        <template v-if="which === 0">
          <div
            class="records1"
            v-for="(item, index) in recentRecords"
            :key="index"
            @click="toDetail(item.transferId)"
          >
            <ul>
              <li>
                <template v-if="item.type === '支出'">
                  <h3 style="color: red">{{ item.type }}</h3>
                  <h3 style="color: red">{{ item.money }}</h3>
                </template>
                <template v-if="item.type === '收入'">
                  <h3 style="color: #23c3bd">{{ item.type }}</h3>
                  <h3 style="color: #23c3bd">{{ item.money }}</h3>
                </template>
                <template v-if="item.type === '提现' || item.type === '充值'">
                  <h3>{{ item.type }}</h3>
                  <h3>{{ item.money }}</h3>
                </template>
              </li>
              <li>交易时间：{{ item.createTime }}</li>
              <li>
                交易流水号：{{ item.transferId }}
                <p>{{ item.name }}</p>
              </li>
              <li>
                <template v-if="item.type === '收入'||item.type === '支出'">
                  <p>交易对象：{{ item.username }}</p>
                </template>
                <template v-else>
                  <p>网上支付</p>
                </template>
              </li>
            </ul>
          </div>
        </template>

        <!-- 查询转账记录 -->
        <template v-if="which === 1">
          <div
            class="records1"
            v-for="(item, index) in transferRecords"
            :key="index"
            @click="toDetail(item.transferId)"
          >
            <ul>
              <li>
                <template v-if="item.type === '支出'">
                  <h3 style="color: red">{{ item.type }}</h3>
                  <h3 style="color: red">{{ item.money }}</h3>
                </template>
                <template v-if="item.type === '收入'">
                  <h3 style="color: #23c3bd">{{ item.type }}</h3>
                  <h3 style="color: #23c3bd">{{ item.money }}</h3>
                </template>
              </li>
              <li>交易时间：{{ item.createTime }}</li>
              <li>
                交易流水号：{{ item.transferId }}
                <p>{{ item.name }}</p>
              </li>
              <li>
                <template v-if="item.type === '收入'||item.type === '支出'">
                  <p>交易对象：{{ item.username }}</p>
                </template>
                <template v-else>
                  <p>网上支付</p>
                </template>
              </li>
            </ul>
          </div>
        </template>

        <!-- 查询提现记录 -->
        <template v-if="which === 2">
          <div
            class="records1"
            v-for="(item, index) in withdrawRecords"
            :key="index"
            @click="toDetail(item.transferId)"
          >
            <ul>
              <li>
                <h3>{{ item.type }}</h3>
                <h3>{{ item.money }}</h3>
              </li>
              <li>交易时间：{{ item.createTime }}</li>
              <li>
                交易流水号：{{ item.transferId }}
                <p>{{ item.name }}</p>
              </li>
              <li>
                <template v-if="item.type === '收入'||item.type === '支出'">
                  <p>交易对象：{{ item.username }}</p>
                </template>
                <template v-else>
                  <p>网上支付</p>
                </template>
              </li>
            </ul>
          </div>
        </template>

        <!-- 查询充值记录 -->
        <template v-if="which === 3">
          <div
            class="records1"
            v-for="(item, index) in rechargeRecords"
            :key="index"
            @click="toDetail(item.transferId)"
          >
            <ul>
              <li>
                <h3>{{ item.type }}</h3>
                <h3>{{ item.money }}</h3>
              </li>
              <li>交易时间：{{ item.createTime }}</li>
              <li>
                交易流水号：{{ item.transferId }}
                <p>{{ item.name }}</p>
              </li>
              <li>
                <template v-if="item.type === '收入'||item.type === '支出'">
                  <p>交易对象：{{ item.username }}</p>
                </template>
                <template v-else>
                  <p>网上支付</p>
                </template>
              </li>
            </ul>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import DealNav from "../../components/DealNav.vue";
import { record, getSpecificRecord } from "../../api/api";
export default {
  name: "Record",
  components: { DealNav },
  data() {
    return {
      title: "交易记录",
      which: 0,
      date: "",
      userId: "7",
      specificRecords: [],
      transferRecords: [],
      rechargeRecords: [],
      withdrawRecords: [],
      recentRecords: [],
    };
  },
  methods: {
    toDetail(transferId) {
      this.$router.push({
        path: "/deal/details",
        query: {
          transferId: transferId,
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
        newEl.style.color = "#5684FF";
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
                username: el.username,
                type:''
              };
              // 充值005，提现006，转账002，
              if (el.type === "0002") {
                temp.money = "+" + Number(temp.money).toFixed(2);
                temp.type = "收入";
              } else if (el.type === "0006") {
                temp.type = "提现";
              } else if (el.type === "0005") {
                temp.type = "充值";
              } else if (el.type === "0013") {
                temp.money = "-" + Number(temp.money).toFixed(2);
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
    document.querySelectorAll(".nav ul li h3")[0].style.color = "#5684FF";
  },
  created() {
    record().then(
      (value) => {
        console.log(value);
        if (value.code === 200) {
          sessionStorage.setItem("recordList", JSON.stringify(value.data));
          this.recentRecords = [];
          value.data.forEach((el) => {
            let temp = {
              name: el.state === "1" ? "交易成功" : "交易失败",
              money: el.money,
              createTime: el.createTime,
              transferId: el.id,
              username: el.username,
              type:''
            };
            // 充值005，提现006，转账002，
            if (el.type === "0002") {
              temp.money = "+" + Number(temp.money).toFixed(2);
              temp.type = "收入";
              this.transferRecords.push(temp);
            } else if (el.type === "0006") {
              temp.money = Number(temp.money).toFixed(2);
              temp.type = "提现";
              this.withdrawRecords.push(temp);
            } else if (el.type === "0005") {
              temp.money = Number(temp.money).toFixed(2);
              temp.type = "充值";
              this.rechargeRecords.push(temp);
            } else if (el.type === "0013") {
              temp.money = "-" + Number(temp.money).toFixed(2);
              temp.type = "支出";
              this.transferRecords.push(temp);
            }
            this.recentRecords.push(temp);
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
.record {
  position: fixed;
  left: 0;
  right: 0;
  top: 50px;
  bottom: 0;
  overflow-y: auto;
}
.nav {
  ul {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 50px;
    width: 100vw;
    margin-top: 10px;
    li {
      h3 {
        font-size: 22px;
        // color: #5684ff;
        color: #999;
        font-weight: 500;
      }
    }
  }
}

.records1 {
  width: 94vw;
  height: 130px;
  height: auto;
  margin: 15px auto;
  background: #f2f2f2;
  border-radius: 10px;
  ul {
    width: 100%;
    li {
      width: 94%;
      padding: 0 3%;
      display: flex;
      justify-content: space-between;
      height: 27px;
      margin: 5px 0 10px 0;
      p {
        color: #000;
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