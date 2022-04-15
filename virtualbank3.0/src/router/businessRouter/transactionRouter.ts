import { RouteRecordRaw } from 'vue-router'

const transactionRouter: RouteRecordRaw[] = [
  {
    path: '/transaction',
    redirect: '/',
    component: () => import('@/views/transaction/IndexView.vue'),
    children: [
      // 充值
      {
        path: 'recharge',
        name: 'RechargeView',
        component: () => import('@/views/transaction/RechargeView.vue'),
      },
      // 提现
      {
        path: 'withdraw',
        name: 'WithdrawView',
        component: () => import('@/views/transaction/WithdrawView.vue'),
      },
      // 转账
      {
        path: 'transfer',
        name: 'TransferView',
        component: () => import('@/views/transaction/TransferView.vue'),
      },
      // 余额查询
      {
        path: 'balance',
        name: 'BalanceView',
        component: () => import('@/views/transaction/BalanceView.vue'),
      },
      // 交易记录
      {
        path: 'tradingRecords',
        name: 'TrandingRecords',
        component: () => import('@/views/transaction/TrandingRecords.vue'),
      },
      // 操作成功
      {
        path: 'tradingsuccess',
        name: 'TradingSuccess',
        component: () => import('@/views/transaction/TradingSuccess.vue'),
      },
      // 按卡号查交易记录
      {
        path: 'record',
        name: 'RecordView',
        component: () => import('@/views/transaction/RecordView.vue'),
      },
      // 交易记录详情页
      {
        path: 'recordDetail',
        name: 'RecordDetail',
        component: () => import('@/views/transaction/RecordDetail.vue'),
      },
    ],
  },
]

export default transactionRouter
