import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 修改头像的数据
    pathMan: require("@/assets/me/man.png"),
    pathWoman: require("@/assets/me/woman.png"),
    pathAvatar: require("@/assets/me/avatar1.jpg"),
    // 皮肤
    bgArr1:require("../assets/images/400.jpg"),
    bgArr2:require("../assets/index/bg3.jpg"),
    bgArr3:require("../assets/index/bg2.png"),
    cardList: [], //卡的信息
    recordList: [], //交易记录详情
    totalAssets:0,  //持仓总金额
    singleAssets:0,  //持仓单个金额
  },
  mutations: {
    // 获取卡的信息
    getcardList(state, params) {
      state.cardList = params
    },
    // 获取交易记录 
    getrecordList(state, params) {
      state.recordList = params
    },
    // 获取持仓总资产
    getTotalAssets(state,params){
      state.totalAssets = params
    },
    // 获取单条持仓金额
    getSingleAssets(state,params){
      state.singleAssets = params;
    },

  },
  actions: {
  },
  modules: {
  }
})
