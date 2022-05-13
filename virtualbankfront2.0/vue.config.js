let proxyobj = {}
proxyobj['/'] = {
    //websocket
    ws: false,
    //目标地址
    // target:'http://1.116.53.124:8080/bank2',
    // target:"http://192.168.71.230:8084",
    // target:"http://192.168.71.144:8080 ",
    target: "http://192.168.71.86:8080",
    // target: "http://192.168.71.61:8080",
    // target:'http://localhost:9091',

    //发送请求头host会被设置成target 
    changeOrigin: true, 

    //不重写请求地址
    pathRewrite: {
        '^/': '/'
    }
}
module.exports = {
    devServer: {
        host: 'localhost',
        port: '9097',
        https: false,                // 是否开启http协议
        open: false,                  // 是否自动打开页面
        proxy: proxyobj,
    }
}
