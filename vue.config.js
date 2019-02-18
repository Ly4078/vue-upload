module.exports = {
    // 配置 axios 代理请求
    baseUrl: './',
    devServer: {
        // port: 8080,
        proxy: {
            '/api': {
                // target:'http://apis.juhe.cn/',
                target:'http://120.78.70.187:9081/',  //测试
                // target: 'https://xiang7.net/', //生产
                    // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                changeOrigin: true, 
                ws: true,
                pathRewrite: {
                    // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可
                     '^/api': '' 
                }
            }
        }
    }
};
