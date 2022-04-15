/**
 * @description 充值和提现的类型
 */
type deal = {
  payPassword:string
  money:string
  cardId:string
}

/**
 * @description 银行卡列表数据类型
 */
type bankCard = {
  id:string
  userId:string
  cardNumber:string
  cardPhone:string
  cardMoney:string
  bankType:string
  cardType:string
  cardState:string
  dailyMoney:string
}

/**
 * @description 转账
 */
type transfer = {
  toName: string
  toAccount: string
  fromAccount: string
  money: string
  payPassword: string
}

/**
 * @description 跨行转账
 */
 type crossTransfer = {
  toName: string
  toAccount: string
  fromAccount: string
  money: string
  payPassword: string
  bankType:string
}