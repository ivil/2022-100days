<template>
  <div class="TransferPeople">
    <acc-navigation :title="title" />
    <div class="list" v-show="listShow">
      <ul>
        <li
          v-for="(item, index) in banklist"
          :key="index"
          @click="selectOne(index)" 
        >
          <p>{{ item.username }}</p>
          <p>
            {{ item.bankName }} <span>{{ item.inAccoutId }}</span>
            <i class="el-icon-arrow-right"></i>
          </p>
          <!-- <p>
            <i class="el-icon-arrow-right"></i>
          </p> -->
        </li>
        <!-- <li></li> -->
      </ul>
    </div>

    <!-- 空状态 -->
    <el-empty
      description="没有查询到您的亲朋好友的账户信息！"
      v-show="emptyShow"
    ></el-empty>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
import { selectUserFriends } from "../../api/api";
export default {
  name: "TransferPeople",
  components: { AccNavigation },
  data() {
    return {
      title: "转账伙伴",
      emptyShow: false, //空状态默认为隐藏
      listShow: false, //列表默认为隐藏
      banklist: [
        // {
        //   username: "李小丽",
        //   bankName: "中国银行",
        //   inAccoutId: "1231231231231231",
        // },
      ],
    };
  },
  methods: {
    // 点击好友后，返回转账页面，数据自动填充
    selectOne(index) {
      this.$router.push({
        path: "/transferReset",
        query: { index: index },
      });
    },
  },
  mounted() {
    // 加载出历史转账好友
    selectUserFriends().then((value) => {
      console.log(value);
      if (value.code === 200) {
          this.banklist = [];
        value.data.forEach((element) => {
          let obj = {
            username: "",
            bankName: "",
            inAccoutId: "",
          };
          obj.username = element.friendName;
          obj.bankName = element.bankName;
          obj.inAccoutId = element.accountId;
          this.banklist.push(obj);
        });
        this.listShow = true;
        this.emptyShow = false;
      } else if (value.code === 500) {
        this.listShow = false;
        this.emptyShow = true;
      }
    });
  },
};
</script>

<style lang="less" scoped>
@box-shadow: 0px 6px 12px #999;
@border-bottom: 1px solid #999;

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.TransferPeople {
  width: 100%;
  height: 100%;
  background: #f2f2f2;
  position: fixed;
}
.list {
  width: 100%;
  height: auto;
  background: lightblue;
  margin-top: 20px;
  ul {
    width: 100%;
    li {
      width: 90%;
      height: 50px;
      padding: 10px 5%;
      background: #fff;
      p {
        text-align: left;
        font-size: 18px;
        &:nth-child(2) {
          color: rgb(117, 115, 115);
          font-size: 16px;
          line-height: 26px;
          /deep/.el-icon-arrow-right:before{
            margin-left: 70px;
            font-size: 22px;
          }
        }
      }
    }
  }
}
/deep/.el-empty__description p {
  font-size: 18px;
}
</style>