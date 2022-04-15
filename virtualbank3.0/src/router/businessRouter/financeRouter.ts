import { RouteRecordRaw } from 'vue-router'

const financeRouter: Array<RouteRecordRaw> = [
  // 风险评估
  {
    path: '/RiskEstimate',
    name: 'RiskEstimate',
    component: () => import('@/views/fund/RiskEstimate.vue'),
  },
  // 基金详情
  {
    path: '/FundDetail',
    name: 'FundDetail',
    component: () => import('@/views/fund/FundDetail.vue'),
  },
  {
    path: '/RedeemFund',
    name: 'RedeemFund',
    component: () => import('@/views/fund/RedeemFund.vue'),
  },
  // 赎回
  {
    path: '/OnPosition',
    name: 'OnPosition',
    component: () => import('@/views/fund/OnPosition.vue'),
  },
  // 货币型基金
  {
    path: '/CurrencyFund',
    name: 'CurrencyFund',
    component: () => import('@/views/fund/CurrencyFund.vue'),
  },
  // 股票型基金
  {
    path: '/SharesFund',
    name: 'SharesFund',
    component: () => import('@/views/fund/SharesFund.vue'),
  },
  {
    path: '/RiskResult',
    name: 'RiskResult',
    component: () => import('@/views/fund/RiskResult.vue'),
  },
  {
    path: '/TradeRecord',
    name: 'TradeRecord',
    component: () => import('@/views/fund/TradeRecord.vue'),
  },
]
export default financeRouter
