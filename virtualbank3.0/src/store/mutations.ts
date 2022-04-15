const mutations = {
  getFund(state: { oneFund: object }, payload: object) {
    state.oneFund = payload
  },
  getPositionFund(state: { positionFund: object }, payload: object) {
    state.positionFund = payload
  },
  getname(state: any, payload: string) {
    state.name1 = payload
  },
  getmoney(state: any, payload: string) {
    state.money1 = payload
  },
  getname2(state: any, payload: string) {
    state.name2 = payload
  },
  getmoney2(state: any, payload: string) {
    state.money2 = payload
  },
  changeRisk(state: any) {
    state.isRisk = true
  },
  getRiskLevel(state: any, payload: string) {
    state.riskLevel = payload
  },
  getAssets(state: any, payload: string) {
    state.assets = payload
  },
  getRate(state: any, payload: any) {
    state.rate = payload
  },
  setStatusOfOA(state: any, payload: any) {
    // 开户状态
    state.statusOfOpenAccount = payload
  },
  setStatusOfBC(state: any, payload: any) {
    // 绑卡状态
    state.statusOfBindCard = payload
  },
  setToken(state: any, payload: any) {
    // 设置token
    state.token = payload
  },
}

export default { mutations }
