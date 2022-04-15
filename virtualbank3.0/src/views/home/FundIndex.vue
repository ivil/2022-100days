<template>
  <div class="box">
    <van-tabs v-model:active="active" animated style="width: 100%">
      <van-tab title="基金产品">
        <div class="fundnav">
          <div
            style="display: flex; flex-wrap: wrap; width: 25%; justify-content: center; margin-top: 20px"
            v-for="item in navdata"
            :key="item"
          >
            <div style="width: 90%; display: flex; justify-content: center">
              <router-link :to="item.url">
                <!--                <i :class="item.iconclass" style="font-size: 30px; color: #198cff"></i>-->
                <van-icon :name="item.iconclass" size="30" color="rgb(25,140,255)" />
              </router-link>
            </div>

            <div style="width: 90%; display: flex; justify-content: center; font-size: 15px">
              <router-link :to="item.url">
                <span style="color: black">{{ item.navname }}</span>
              </router-link>
            </div>
          </div>
          <div style="height: 20px; width: 100%"></div>
        </div>
        <div class="huoqi">
          <!--          标题-->
          <div style="width: 75%">
            <div style="text-align: center; font-size: larger; margin-top: 10px">为您推荐</div>
            <div style="text-align: center; color: darkgray">闲钱有招，理财有方，灵活申赎</div>
          </div>
          <!--          内容-->
          <div class="goods" v-for="item in data.sharesFund" :key="item" @click="todetail(item)">
            <div style="width: 95%; margin: 10px 0 0 10px">{{ item.name }}</div>
            <div style="width: 40%; height: 50px; margin: 10px 0 10px 10px">
              <span style="font-size: 25px; color: rgb(218, 90, 43)">{{ item.todayIncrease }}%</span>
              <br />
              <span style="font-size: small">近七日年化率</span>
            </div>
            <div style="width: 51%; height: 50px; margin: 10px 0 10px 10px">
              <span style="">{{ item.introduce }}</span>
              <br />
              <div style="margin-top: 7px">
                <span style="font-size: small" v-if="item.riskLevel === '01'"
                  >代销 | {{ item.minimum }}元起 | 低风险</span
                >
                <span style="font-size: small" v-if="item.riskLevel === '02'"
                >代销 | {{ item.minimum }}元起 | 高风险</span
                >
              </div>
            </div>
          </div>
          <div style="width: 100%; height: 20px"></div>
        </div>
        <!--        <div class="huoqi">-->
        <!--          &lt;!&ndash;          标题&ndash;&gt;-->
        <!--          <div style="width: 75%">-->
        <!--            <div style="text-align: center; font-size: larger; margin-top: 10px">货币型产品</div>-->
        <!--            <div style="text-align: center; color: darkgray">闲钱有招，理财有方，灵活申赎</div>-->
        <!--          </div>-->
        <!--          &lt;!&ndash;          内容&ndash;&gt;-->
        <!--          <div class="goods" v-for="index in 3" :key="index" @click="todetail(data.curruncyFund[index])">-->
        <!--            <div style="width: 95%; margin: 10px 0 0 10px">{{ data.curruncyFund[index].name }}</div>-->
        <!--            <div style="width: 40%; height: 50px; margin: 10px 0 10px 10px">-->
        <!--              <span style="font-size: 25px; color: rgb(218, 90, 43)">{{ data.curruncyFund[index].todayIncrease }}</span>-->
        <!--              <br />-->
        <!--              <span style="font-size: small">近七日年化率</span>-->
        <!--            </div>-->
        <!--            <div style="width: 51%; height: 50px; margin: 10px 0 10px 10px">-->
        <!--              <span style="">{{ data.curruncyFund[index].introduce }}</span>-->
        <!--              <br />-->
        <!--              <div style="margin-top: 7px">-->
        <!--                <span style="font-size: small">代销 | {{ data.curruncyFund[index].minimum }}元起 | 较低风险</span>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          <div style="width: 100%; height: 20px"></div>-->
        <!--        </div>-->
        <div style="width: 100%; height: 80px"></div>
      </van-tab>
      <van-tab title="我的基金">
        <div class="allfund">
          <div class="allmonney">总市值(元)</div>
          <div class="number">
            <div style="font-size: 30px; color: orange">{{ data.allFundmoney }}</div>
          </div>
          <div class="tableTitle"></div>
          <div class="seven">
            <div>查定投</div>
            <div>
              <div class="verticalBar"></div>
            </div>
            <div @click="toTrade">查交易</div>
            <div>
              <div class="verticalBar"></div>
            </div>
            <div>去贷款</div>
          </div>
        </div>
        <div style="margin: 10px 0 0 20px">持仓</div>
        <div class="history">
          <div class="histitle">
            <div style="width: 33%; text-align: center">
              <van-tag plain round type="primary" size="large" color="#198cff" text-color="#198cff">产品名称</van-tag>
            </div>
            <div style="width: 33%; text-align: center">
              <!--              <van-tag plain round type="primary" size="large" color="#198cff" text-color="#198cff">收益</van-tag>-->
            </div>
            <div style="width: 33%; text-align: center">
              <van-tag plain round type="primary" size="large" color="#198cff" text-color="#198cff"
                >持有金额/份额</van-tag
              >
            </div>
            <div class="tableTitle"></div>
          </div>
          <div class="hiscontent" v-for="item in data.fundRecord" :key="item" @click="toredeem(item)">
            <div style="width: 33%; text-align: center">{{ item.showName }}</div>
            <div style="width: 33%; text-align: center"></div>
            <div style="width: 33%; text-align: center" v-if="item.showType === '01'">{{ item.showValue }}</div>
            <div style="width: 33%; text-align: center" v-if="item.showType === '02'">{{ item.sharesHeld }}</div>

            <div class="tableTitle"></div>
          </div>
        </div>
        <div style="margin: 10px 0 0 20px">购买过的产品</div>
        <div class="history">
          <div class="histitle">
            <div style="width: 33%; text-align: center">
              <van-tag plain round type="primary" size="large" color="#198cff" text-color="#198cff">产品名称</van-tag>
            </div>
            <div style="width: 33%; text-align: center">
              <van-tag plain round type="primary" size="large" color="#198cff" text-color="#198cff">收益</van-tag>
            </div>
            <div style="width: 33%; text-align: center">
              <van-tag plain round type="primary" size="large" color="#198cff" text-color="#198cff">当前状态</van-tag>
            </div>
            <div class="tableTitle"></div>
          </div>
          <div class="hiscontent" v-for="item in data.stocksList" :key="item">
            <div style="width: 33%; text-align: center">{{ item.name }}</div>
            <div style="width: 33%; text-align: center">{{ item.earnings }}</div>
            <div style="width: 33%; text-align: center">
              <span v-if="item.state == '00'">申购成功</span>
              <span v-if="item.state == '01'">申购中</span>
              <span v-if="item.state == '02'">申购失败</span>
              <span v-if="item.state == '03'">申购可疑</span>
              <span v-if="item.state == '10'">赎回成功</span>
              <span v-if="item.state == '11'">赎回中</span>
              <span v-if="item.state == '12'">赎回失败</span>
              <span v-if="item.state == '13'">赎回可疑</span>
            </div>
            <div class="tableTitle"></div>
          </div>
          <div style="width: 100%; height: 50px; background-color: rgb(245, 245, 245)"></div>
        </div>
      </van-tab>
    </van-tabs>
    <div style="width: 95%; height: 50px; background-color: rgb(245, 245, 245)"></div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import '@/assets/icon/fund1test/iconfont.css'
  import { useStore } from 'vuex'
  import { allFund, allMoney, CurrencyDetail, fundRecord, queryFund, SharesDetail } from '@/axios/business/finance.api'

  export default defineComponent({
    name: 'FundIndex',
    setup() {
      const active = ref(0)
      const navdata = reactive([
        {
          navname: '股票型',
          url: '/SharesFund',
          iconclass: 'refund-o',
        },
        {
          navname: '货币型',
          url: '/CurrencyFund',
          iconclass: 'gold-coin-o',
        },
        {
          navname: '混合类',
          url: 'torisk',
          iconclass: 'after-sale',
        },
        {
          navname: '权益及其他',
          url: 'torisk',
          iconclass: 'chart-trending-o',
        },
        {
          navname: '市场精选',
          url: 'torisk',
          iconclass: 'goods-collect-o',
        },
        {
          navname: '定向专区',
          url: 'torisk',
          iconclass: 'gem-o',
        },
        {
          navname: '问卷评估',
          url: '/RiskEstimate',
          iconclass: 'label-o',
        },
        {
          navname: '全部',
          url: 'torisk',
          iconclass: 'apps-o',
        },
      ])
      const router = useRouter()
      const store = useStore()
      // if (!store.state.isRisk) {
      // }

      // 页面跳转
      function torisk() {
        router.push('/RiskEstimate')
      }

      function toredeem(fund: any) {
        store.commit('getPositionFund', fund)
        router.push('/OnPosition')
      }
      const data = reactive({
        fundall: [
          {
            id: '1',
            name: '阳光雪碧1号(EW202A)',
            introduce: '随时申赎，T+1到账',
            minimum: '0.01',
            todayIncrease: '2.81%',
            riskLevel: '高风险',
          },
          {
            id: '2',
            name: '阳光雪碧2号(EW202A)',
            introduce: '随时申赎，T+1到账',
            minimum: '0.01',
            todayIncrease: '2.81%',
            riskLevel: '高风险',
          },
          {
            id: '3',
            name: '阳光雪碧3号(EW202A)',
            introduce: '随时申赎，T+1到账',
            minimum: '0.01',
            todayIncrease: '2.81%',
            riskLevel: '高风险',
          },
        ],
        somefund: [],
        sharesFund: [] as any[],
        curruncyFund: [] as any[],
        stocksList: [],
        allFundmoney: '',
        fundRecord: [] as any[],
      })

      // allFund().then((value: any) => {
      //   console.log('全部基金', value)
      //   data.somefund = value
      // })
      // 股票基金
      queryFund('02').then((value: any) => {
        console.log('按股票条件查询', value)
        data.sharesFund = value
        // data.fundall = value
      })
      // 货币基金
      queryFund('01').then((value: any) => {
        console.log('按货币条件查询', value)
        data.curruncyFund = value
        // data.fundall = value
      })

      allMoney().then((value: any) => {
        console.log('总资产', value)
        // console.log(data.stocksList)
        // 持仓
        data.fundRecord = value.assetsStocksList
        // console.log(data.fundRecord[1].showType)
        console.log('持仓', data.fundRecord)
        // 购买过的产品
        console.log((data.stocksList = value.purchasedProductsList))
        data.stocksList = value.purchasedProductsList
        // 总市值
        data.allFundmoney = value.assetStructureList[0].assets
        // console.log(data.stocksList)
      })

      // fundRecord().then((value) => {
      //   console.log(value)
      // })

      function todetail(fund: any) {
        if (fund.type === '02')
          // 股票基金详情
          SharesDetail(fund.id).then((value: any) => {
            // console.log('gupiao基金详情', value)
            // console.log(value.Fund)
            store.commit('getFund', value.Fund)
            console.log('xinagq', value.rate)
            store.commit('getRate', value.rate)
            router.push('/FundDetail')
          })
        else {
          // 货币基金详情
          CurrencyDetail(fund.id).then((value: any) => {
            console.log('货币基金详情', value)
            store.commit('getFund', value.monetaryFoudDetail)
            store.commit('getFund', value.Fund)
            router.push('/FundDetail')
          })
        }
      }
      function toTrade() {
        router.push('/TradeRecord')
      }
      onMounted(() => {
        // console.log(data.fundall)
        // 所有基金产品
      })
      return { active, navdata, torisk, todetail, toredeem, data, toTrade }
    },
  })
</script>

<style scoped lang="less">
  .box {
    width: 100vw;
    min-height: 100vh;
    background: rgb(245, 245, 245);
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
    .head {
      width: 100%;
      height: 40px;
      text-align: center;
      position: fixed;
      z-index: 99;
      background-color: white;
    }
    .fundnav {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: 95%;
      background-color: white;
      border-radius: 8px;
      margin: 0 auto;
      margin-top: 50px;
      box-shadow: 3px 3px 3px gainsboro;
    }
    .huoqi {
      display: flex;
      flex-wrap: wrap;
      width: 95%;
      margin: 0 auto;
      margin-top: 10px;
      justify-content: center;
      background-color: white;
      border-radius: 8px;
      box-shadow: 3px 3px 3px gainsboro;
      .goods {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        width: 90%;
        border-radius: 10px;
        //background: linear-gradient(to bottom, #18dcff 0%, white 20% );
        background-color: rgb(249, 247, 252);
      }
    }
    /deep/.van-tabs--line .van-tabs__wrap {
      position: fixed;
      z-index: 99;
      width: 100%;
    }
    .allfund {
      width: 95%;
      margin-top: 10px;
      background-color: rgb(255, 255, 255);
      border-radius: 10px;
      display: flex;
      margin: 0 auto;
      margin-top: 50px;
      flex-wrap: wrap;
      justify-content: center;
      align-content: flex-start;
      box-shadow: 3px 3px 3px gainsboro;
      .allmonney {
        width: 95%;
        text-align: center;
        height: 25px;
        margin-top: 10px;
      }
      .number {
        width: 95%;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 60px;
      }
      .tableTitle {
        position: relative;
        margin: 0 auto;
        margin-top: 10px;
        width: 600px;
        height: 1px;
        background-color: #d4d4d4;
        text-align: center;
        font-size: 16px;
        color: rgba(101, 101, 101, 1);
      }
      .seven {
        color: #198cff;
        width: 1000%;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .verticalBar {
        width: 1Q;
        height: 25px;
        background: gainsboro;
        display: inline-block;
        margin-top: 10px;
        //vertical-align: top;
        //margin-right: 29px;
        //margin-left: 30px;
      }
    }
    .history {
      width: 95%;
      background-color: white;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin: 0 auto;
      margin-top: 10px;
      border-radius: 8px;
      .histitle {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        .tableTitle {
          position: relative;
          margin: 0 auto;
          margin-top: 10px;
          width: 600px;
          height: 1px;
          background-color: #d4d4d4;
          text-align: center;
          font-size: 16px;
          color: rgba(101, 101, 101, 1);
        }
      }
      .hiscontent {
        width: 100%;
        margin-top: 10px;
        display: flex;
        flex-wrap: wrap;
        .tableTitle {
          position: relative;
          margin: 0 auto;
          margin-top: 10px;
          width: 600px;
          height: 1px;
          background-color: #d4d4d4;
          text-align: center;
          font-size: 16px;
          color: rgba(101, 101, 101, 1);
        }
      }
    }
  }
</style>
