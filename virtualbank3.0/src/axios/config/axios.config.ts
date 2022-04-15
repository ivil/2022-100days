import store from '@/store/state'

const token = sessionStorage.getItem('token') || store.state.token || ''

// console.log(token)

const config = {
  headers: {
    Authorization: token,
    token,
    // userid: '2008',
  },
  // baseURL: 'http://n5166r6983.zicp.vip',
  // baseURL: 'http://192.168.71.86:8080',
  baseURL: 'http://u5m1589047.qicp.vip',
  // timeout: 9999,
  // headers: {
  //     'Content-Type': 'application/x-www-form-urlencoded'
  // },
}

export default config
