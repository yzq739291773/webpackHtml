const path = require("path")
const common = require('./webpack.base.conf.js');
const uglify = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const webpack = require("webpack")


module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new uglify(),
        new webpack.DefinePlugin({
            'process.env.yzq': '"pro11"'
        })
    ],
    // 配置webpack开发服务功能
    devServer: {
        // 设置基本目录结构
        contentBase: path.resolve(__dirname, '../dist'),
        // 服务器的ip地址，可以使用ip也可以使用localhost
        host: 'localhost',
        // 服务端压缩是否开启
        compress: true,
        // 配置服务端口号
        port: 8888
    }
})

console.log('run2', process.env.NODE_ENV);