const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    host: 'localhost',
    // port: '9097',
    port: '8080',
    https: false, // 是否开启https协议
    proxy: {
      '/': {
        // target: 'http://localhost:9091',
        target: 'http://u5m1589047.qicp.vip',
        // target: 'http://d5h1597737.qicp.vip',
        // target: 'http://n5166r6983.zicp.vip', // 全部
        // target: 'http://n5166r6983.zicp.vip',
        changeOrigin: true, // 是否跨域
        ws: false, // 是否代理websocket
        // secure:false,//是否https接口
        pathRewrite: {
          '^/': '/', // 不重写请求地址
        },
      },
    },
  },
  publicPath: './', // 给打包出来的路径附上 ./ 前缀
  // outputDir: '../www', // 将项目打包到 Cordova项目的www目录，文件夹目录不一样的，这个需要自己改
})
