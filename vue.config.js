const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true,
//   devServer: {
//     port: 8080,
//     proxy: {
//       '/brain-mri': {
//         target: 'http://127.0.0.1:4523/m2/4793041-4447214-default',
//         changeOrigin: true,
//         pathRewrite: {
//           '^/brain-mri': ''
//         }
//       }
//     }
//   }
// })
module.exports = defineConfig({ 
  devServer: { 
    proxy: { 
      '/*': { 
        target: 'http://10.66.56.23:5000', 
        // 你的后端服务器地址和端口 
        changeOrigin: true, 
        pathRewrite: { 
           "^/*":""
        } 
      } 
    } 
  } ,
  configureWebpack: {
    resolve: {
      fallback: {
        fs: false, // fs 模块在浏览器环境中不可用，设置为 false
        path: require.resolve("path-browserify"), // 使用 path-browserify polyfill
        crypto: require.resolve("crypto-browserify") ,// 使用 crypto-browserify polyfill
        stream: require.resolve("stream-browserify")
      }
    }
  },
  chainWebpack: config => {
    config.module
      .rule('tif')
      .test(/\.tif$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'images/[name].[hash:8].[ext]'
      })
      .end();
  }
})