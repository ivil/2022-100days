<template>
  <van-nav-bar title="风险评估" left-text="返回" left-arrow @click-left="onClickLeft" />
  <div class="box">
    <div style="width: 100%; background-color: white; border-radius: 0 0 10px 10px">
      <div style="width: 90%; margin: 0 auto">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您尚未进行风险承受能力评估,根据监管需求,手机银行进行首次评估仅基金/集合计划产品,代销理财。
      </div>
    </div>

    <div style="width: 100%; height: 100%; text-align: left; margin: 10px 0 0 10px">
      <span style="font-size: 30px; color: #198cff">{{ i + 1 }}</span
      ><span>/10</span>
    </div>
    <!--    问题-->
    <div class="question">
      <div style="width: 90%; margin-left: 10px"><h4 v-text="questionlist[i].questionTitile"></h4></div>
      <van-radio-group v-model="questionlist[i].checked" style="margin-left: 10px">
        <van-radio name="1" style="margin-bottom: 10px"><span v-text="questionlist[i].choice[0]"></span></van-radio>
        <van-radio name="2" style="margin-bottom: 10px"><span v-text="questionlist[i].choice[1]"></span></van-radio>
        <van-radio name="3" style="margin-bottom: 10px"><span v-text="questionlist[i].choice[2]"></span></van-radio>
        <van-radio name="4" style="margin-bottom: 10px"><span v-text="questionlist[i].choice[3]"></span></van-radio>
      </van-radio-group>
    </div>
    <!--按钮-->
    <div style="width: 95%; display: flex; justify-content: space-between">
      <div class="addcard" v-if="i > 0" @click="up">
        <div class="addfont">上一题</div>
      </div>
      <div v-if="i == 0" style="width: 47%; height: 50px"></div>
      <div class="addcard" v-if="i < 9" @click="down">
        <div class="addfont">下一题</div>
      </div>
      <div class="addcard" v-if="i == 9">
        <div class="addfont" @click="submit">提交</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { Dialog } from 'vant'
  import { useStore } from 'vuex'
  import riskLevel from '@/axios/business/finance.api'

  export default defineComponent({
    name: 'RiskEstimate',
    setup() {
      const router = useRouter()
      function onClickLeft() {
        router.go(-1)
      }

      const questionlist = reactive([
        {
          id: '1',
          questionTitile: '您的年龄是？', // 标题
          choice: ['18-25', '26-50', '51-60', '60以上'],
          fraction: '8', // 分数
          checked: '',
        },
        {
          id: '2',
          questionTitile: '在您每年的家庭收入中，可用于作金融投资(储蓄存款除外)额比例为？', // 标题
          choice: ['小于10%', '10%至25%', '25%至50%', '大于50%'],
          fraction: '', // 分数
          checked: '',
        },
        {
          id: '3',
          questionTitile: '您的家庭总资产净值为(折合人民币)？', // 标题
          choice: ['15万元及以下', '15万元(不含)-50万元(含)', '50万元(不含)-100万元(含)', '100万元以上'],
          fraction: '', //
          checked: '',
        },
        {
          id: '4',
          questionTitile: '以下哪项描述最符合您的投资态度？', // 标题
          choice: [
            '厌恶风险，不希望本金损失，希望获得稳定回报',
            '保守投资，不希望本金损失，愿意承担一定幅度的收益波动',
            '寻求资金的较高收益和成长性，愿意为此承担有限本金损失',
            '希望赚取高回报，愿意为此承担较大本金损失',
          ],
          fraction: '', //
          checked: '',
        },
        {
          id: '5',
          questionTitile: '您有多少年投资股票、基金、外汇、金融衍生产品等风险投资品的经验？', // 标题
          choice: ['没有经验', '少于2年', '2至5年', '5年以上'],
          fraction: '', //
          checked: '',
        },
        {
          id: '6',
          questionTitile: '以下哪项最能说明您的投资经验？', // 标题
          choice: [
            '除存款、国债外，我几乎不投资其他金融产品',
            '大部分投资于存款、国债等，较少投资于股票、基金等风险产品',
            '资产均衡地分布于存款、国债、银行理财产品、信托产品、股票、基金等',
            '大部分投资于股票、基金、外汇等高风险产品，较少投资于存款、国债',
          ],
          fraction: '', //
          checked: '',
        },
        {
          id: '7',
          questionTitile: '本金100万元，不提供保本承诺的情况下，您会选择哪一种投资机会？', // 标题
          choice: [
            '有100%的机会赢取1000元现金，并保证归还',
            '有50%的机会赢取5万元现金，并有较高可能性归还本金',
            '有25%的机会赢取50万元现金，并有一定的可能性损失本金',
            '有10%的机会赢取100万元现金，并有较高可能性损失本金',
          ],
          fraction: '', //
          checked: '',
        },
        {
          id: '8',
          questionTitile: '投资于理财、股票、基金等金融投资品(不含存款和国债)时，您可接受的最长投资期限是多久？', // 标题
          choice: ['1年以下', '1-3年', '3-5年', '5年以上'],
          fraction: '', //
          checked: '',
        },
        {
          id: '9',
          questionTitile: '您的投资目的是？', // 标题
          choice: ['资产保值', '资产稳健增长', '资产快速增长', '资产猛速增长'],
          fraction: '', //
          checked: '',
        },
        {
          id: '10',
          questionTitile: '您投资产品的价值出现何种程度的波动时，您会呈现明显的焦虑？', // 标题
          choice: ['本金无损失，但收益未达预期', '本金10%以内的损失', '本金20%-50%的损失', '本金50%以上损失'],
          fraction: '', //
          checked: '',
        },
      ])
      const i = ref(0)
      function up() {
        i.value -= 1
      }
      function down() {
        i.value += 1
      }
      let h = false
      function submit() {
        for (let j = 0; j < questionlist.length; j++) {
          if (questionlist[j].checked === '') {
            h = true
          }
        }
        if (h === true) {
          Dialog.confirm({
            title: '提示',
            message: '您还有未完成的题目',
          })
            .then(() => {
              // on confirm
            })
            .catch(() => {
              // on cancel
            })
        } else {
          let allpoint = 0
          let thispoint = 0
          for (let j = 0; j < questionlist.length; j++) {
            if (questionlist[j].checked === '1') {
              thispoint = 10
              allpoint += thispoint
            }
            if (questionlist[j].checked === '2') {
              thispoint = 6
              allpoint += thispoint
            }
            if (questionlist[j].checked === '3') {
              thispoint = 4
              allpoint += thispoint
            }
            if (questionlist[j].checked === '4') {
              thispoint = 0
              allpoint += thispoint
            }
          }
          console.log(allpoint)
          const store = useStore()
          riskLevel(allpoint).then((value: any) => {
            console.log('测评结果', value)
            store.commit('getRiskLevel', value.riskLevel)
          })
        }
      }
      return { onClickLeft, questionlist, up, i, down, submit }
    },
  })
</script>

<style scoped lang="less">
  .box {
    width: 100vw;
    min-height: 95vh;
    background-color: rgb(245, 245, 245);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    .question {
      margin-top: 10px;
      width: 95%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      background-color: white;
      border-radius: 10px;
    }
    .addcard {
      width: 47%;
      height: 50px;
      margin-top: 10px;
      background-color: rgb(245, 245, 245);
      border-radius: 5px;
      border: 1px solid #198cff;
      display: flex;
      justify-content: center;
      align-items: center;

      .addfont {
        color: #198cff;
      }
    }
  }
</style>
