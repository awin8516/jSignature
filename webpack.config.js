const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'), //输出位置
    publicPath: '/assets/', //指定资源文件引用的目录
    filename: 'jSignature.js' //输入文件
  },
  mode: 'development', // 设置mode
  devServer: {
    host: '0.0.0.0', //服务器的ip地址 localhost:1550 / 192.168.254.22:1550
    port: 1550, //端口
    open: true //自动打开页面
  },
  module: {
    rules: [
      // {
      //   test: /\.jsx?$/,
      //   exclude: /node_modules/,
      //   loader: 'babel-loader'
      // },
      {
        test: /\.css$/,
        use:['style-loader','css-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use:['url-loader?limit=8192']
      }
    ]
  }
}
