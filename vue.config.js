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
  } 
})