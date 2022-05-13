<template>
  <div class="Transfer">
    <acc-navigation :title="title" />
    <div class="nav">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <div class="getName">
          <ul>
            <li>
              <el-form-item prop="user">
                <el-input
                  type="text"
                  placeholder="请输入用户名"
                  v-model="ruleForm.user"
                  autocomplete="off"
                >
                  <template slot="prepend">收款户名</template>
                </el-input>
              </el-form-item>
              <!-- </el-form> -->
              <i class="el-icon-user" @click="recode"></i>
            </li>

            <li>
              <el-form-item prop="get">
                <el-input
                  type="number"
                  placeholder="请输入收款账号"
                  v-model="ruleForm.get"
                  autocomplete="off"
                  maxlength="19"
                  minlength="16"
                >
                  <template slot="prepend">收款账户</template>
                </el-input>
              </el-form-item>
              <!-- </el-form> -->
            </li>

            <li style="border-bottom: none; height: 50px">
              <p>收款银行</p>
              <!-- <p style="letter-spacing: 2px">请选择收款银行<i class="el-icon-arrow-right"></i></p> -->
              <p>
                <el-select v-model="value2" placeholder="请选择收款银行">
                  <el-option
                    v-for="item in options2"
                    :key="item.value2"
                    :label="item.label"
                    :value="item.value2"
                  >
                  </el-option>
                </el-select>
              </p>
            </li>
          </ul>
        </div>

        <div class="payName">
          <ul>
            <li style="height: 50px">
              <p>付款账户</p>
              <p>
                <el-select v-model="value" placeholder="请选择付款账户">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </p>
            </li>

            <li style="border-bottom: none; height: 50px">
              <p>可用余额</p>
              <p style="margin-right: 30px">{{ balance }} 元</p>
            </li>
          </ul>
        </div>

        <div class="payMoney">
          <ul>
            <li style="height: 50px">
              <p>转账金额</p>
            </li>
            <li style="boder-bottom: none">
              <p>￥</p>
              <input
                type="number"
                placeholder="免手续费"
                v-model="money"
                @blur="transfer"
              />
            </li>
            <p style="color: #f56c6c; font-size: 12px">{{ tag }}</p>
          </ul>
        </div>

        <div class="code">
          <input type="text" placeholder="请输入验证码" />
          <p>验证码位置</p>
        </div>

        <div class="time">
          <p>实时 <span>(实时发出)</span></p>
        </div>

        <!-- 点击下一步跳转 -->
        <div class="tab">
          <el-form-item>
            <el-button type="primary" @click="next">下一步</el-button>
          </el-form-item>
        </div>

        <div class="tip">
          <p>温馨提示</p>
          <p>
            1.为了您的资金安全,请勿轻信任何以公检法、网购刷单,客服退换,贷款代办、信用提额、高收益理财等为由
            进行转账要求、谨防电信网络诈骗。<br />
            2.请妥善保管卡号、密码、短信验证码等个人重要信息。
          </p>
        </div>

        <!--  -->
      </el-form>
    </div>
  </div>
</template>

<script>
import AccNavigation from "../../components/AccNavigation.vue";
export default {
  name: "Transfer",
  components: { AccNavigation },
  data() {
    //收款用户名
    var validatePass = (rule, value, callback) => {
      let userName = /^[\u4e00-\u9fa5]{2,6}$/;
      if (value === "") {
        callback(new Error("收款户名不能为空"));
      } else if (userName.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确用户名"));
      }
    };
    // 收款账户
    var validateGet = (rule, value, callback) => {
      let getAccount = /^([1-9]{1})(\d{15}|\d{16}|\d{18})$/;
      if (value === "") {
        callback(new Error("收款账号不能为空"));
      } else if (getAccount.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确收款账号"));
      }
    };

    return {
      title:"转账汇款",
      options: [
        {
          value: "选项1",
          label: "500224...44555",
        },
        {
          value: "选项2",
          label: "500224...44555",
        },
      ],

      options2: [
        {
          value2: "选项1",
          label: "中国银行",
        },
        {
          value2: "选项2",
          label: "工商银行",
        },
      ],
      value: "11111111111",
      value2: "中国银行(默认收款银行)",
      ruleForm: {
        user: "小小丽",
        get: "1234567891111111",
      },
      rules: {
        user: [{ validator: validatePass, trigger: "blur" }],
        get: [{ validator: validateGet, trigger: "blur" }],
      },

      balance: 1200, //账户余额
      money: null, //转账金额
      tag: "", //余额不足提示
    };
  },

  methods: {
    transfer() {
      if (this.money < this.balance) {
        console.log("转账成功");
        this.tag = "";
      } else {
        this.tag = "账户余额不足";
      }
    },

    recode() {
      this.$router.replace({ name: "TransferPeople" });
    },

    // 点击下一步
    next() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid && this.money != null && this.money < this.balance) {
          // 存入缓存到支付页面
          let data = {
            user: this.ruleForm.user,
            get: this.ruleForm.get,
            money: this.money,
          };
          // 存入缓存到详细页面
          this.$router.replace({ name: "Transfer2" });
          // this.$router.replace({ path: "/Transfer2",query:{money:this.money}});
        } else {
          // console.log("error submit!!");
          this.tag = "请输入转账金额";
          return false;
        }
      });
    },
  },
};
</script>

<style lang='less' scoped>
@box-shadow: 0px 6px 12px #999;
@border-bottom: 1px solid #999;

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ul {
  width: 100%;
}
.li {
  width: 94%;
  height: 62px;
  padding: 0 3%;
  border-bottom: @border-bottom;
}
.input {
  width: 240px;
  height: 40px;
  border: none;
  outline: medium;
  margin-left: 15px;
  font-size: 18px;
  text-align: right;
}
.p {
  font-size: 18px;
  line-height: 40px;
  letter-spacing: 5px;
}

.Transfer {
  background: #f2f2f2;
}

.title {
  width: 100%;
  height: 70px;
  margin: 0 auto;
  box-shadow: @box-shadow;
  background: #fff;
  .flex();
  p {
    font-size: 22px;
  }
}

.getName {
  width: 100%;
  height: auto;
  background: #fff;
  margin-top: 20px;
  ul {
    .ul();
    li {
      .li();
      .flex();
      p {
        .p();
        // top: 0;
      }
      input {
        .input();
      }
    }
  }
}
/deep/.el-form-item__error {
  left: 54%;
  margin-left: 32px;
  padding-top: 0px;
}
/deep/.el-input-group__prepend {
  border: none;
  font-size: 18px;
  color: #000;
  background-color: #fff;
  padding: 0px;
  letter-spacing: 5px;
}
// 收款户名
/deep/.demo-ruleForm {
  height: 50px;
}
/deep/.el-icon-user:before {
  font-size: 22px;
  // line-height: 30px;
  position: absolute;
  right: 10px;
  top: 97px;
}
.payName {
  width: 100%;
  height: auto;
  background: #fff;
  margin-top: 20px;
  ul {
    .ul();
    li {
      .li();
      .flex();
      p {
        .p();
        &:nth-child(2) {
          letter-spacing: 0px;
        }
      }
    }
  }
}
/deep/.el-input__inner {
  font-size: 18px;
  width: 240px;
  text-align: right;
  border: none;
  &:nth-child(5) {
    text-align: left;
  }
}

.payMoney {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  background: #fff;
  margin-top: 20px;
  .ul();
  li {
    .li();
    .flex();
    p {
      .p();
    }
    input {
      .input();
    }
    &:nth-child(2) {
      height: 60px;
      p {
        font-weight: 800;
        font-size: 32px;
      }
      input {
        text-align: left;
        width: 300px;
      }
    }
  }
}

// 验证码
.code {
  width: 100%;
  height: 50px;
  display: flex;
  input {
    width: 200px;
    height: 40px;
    margin: 5px 0;
    border: none;
    outline: medium;
    font-size: 18px;
    text-indent: 8px;
  }
  p {
    width: 150px;
    height: 50px;
    line-height: 50px;
    font-size: 20px;
  }
}

.time {
  width: 100%;
  height: 50px;
  .flex();
  p {
    font-size: 18px;
    color: orange;
    text-indent: 10px;
    span {
      color: #999;
    }
  }
}

.tab {
  width: 350px;
  height: 60px;
  background: rgb(183, 48, 224);
  margin-top: 10px;
  border-radius: 5px;
  margin: 10px auto;
  p {
    color: #fff;
    line-height: 60px;
    font-size: 22px;
    letter-spacing: 5px;
  }
}

/deep/.el-button--primary {
  height: 60px;
  width: 100%;
  background: rgb(183, 48, 224);
  border: none;
}
/deep/.el-button--primary:focus,
.el-button--primary:hover {
  background: rgb(183, 48, 224);
  border: none;
}
/deep/.el-button {
  font-size: 20px;
  letter-spacing: 3px;
}

.tip {
  width: 340px;
  height: auto;
  margin: 35px auto 0px;
  margin-top: 35px;
  p {
    text-align: left;
    color: rgb(82, 78, 78);
    line-height: 22px;
    &:nth-child(1) {
      color: orange;
      margin-bottom: 10px;
    }
  }
}
</style>