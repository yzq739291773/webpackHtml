const path = require("path")
const htmlPlugin = require('html-webpack-plugin') //html 打包压缩
const extractTextPlugin = require('extract-text-webpack-plugin') //css分离
const webpack = require("webpack")
const glob = require('glob');
const PurifyCSSPlugin = require("purifycss-webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const config = require('../config')
const env = process.env.NODE_ENV;
console.log('env', env)
console.log('配置', config[env].env.NODE_ENV)
var website = {
    publicPath: "http://localhost:8888/"
        // publicPath:"http://192.168.1.103:8888/"
}


module.exports = {
    // 入口文件的配置项
    entry: {
        // 里面的main是可以随便写的
        main: './src/main.js',
    },
    // 出口文件的配置项
    output: {
        // 打包的路径
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: website.publicPath //publicPath：主要作用就是处理静态文件路径的。
    },
    // 模块：例如解读css,图片如何转换，压缩
    module: {
        rules: [{
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        { loader: "css-loader" },
                        {
                            loader: "postcss-loader",
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpg|gif|jpeg)/, //是匹配图片文件后缀名称
                use: [{
                    loader: 'url-loader', //是指定使用的loader和loader的配置参数
                    options: {
                        limit: 500, //是把小于500B的文件打成Base64的格式，写入JS
                        outputPath: 'images/', //打包后的图片放到images文件夹下
                    }
                }]
            },
            {
                test: /\.(htm|html)$/i,
                use: ['html-withimg-loader']
            },
            {
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                            loader: "css-loader" // translates CSS into CommonJS
                        },
                        {
                            loader: "less-loader" // compiles Less to CSS
                        }
                    ],
                    // use style-loader in development
                    fallback: "style-loader"
                })

            },
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader" // translates CSS into CommonJS
                    }, {
                        loader: "sass-loader" // compiles Sass to CSS
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })
            },
            {
                test: /\.(jsx|js)$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: /node_modules/
            },

        ]
    },
    // 插件，用于生产模板和各项功能
    plugins: [
        new webpack.DefinePlugin({
            'process.env.yzq': config[env].env.NODE_ENV
        }),
        new htmlPlugin({
            minify: { //是对html文件进行压缩
                removeAttributeQuotes: true //removeAttrubuteQuotes是却掉属性的双引号。
            },
            hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template: './src/index.html' //是要打包的html模版路径和文件名称。

        }),
        new extractTextPlugin("css/index.css"), //这里的/css/index.css 是分离后的路径
        new PurifyCSSPlugin({
            //这里配置了一个paths，主要是需找html模板，purifycss根据这个配置会遍历你的文件，查找哪些css被使用了。
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
    ],
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        minimizer: [
            new UglifyJsPlugin({ /* your config */ })
        ], // [new UglifyJsPlugin({...})]
        splitChunks: {
            chunks: 'async',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: false,
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    chunks: 'initial',
                    priority: -10,
                    reuseExistingChunk: false,
                    test: /node_modules\/(.*)\.js/
                },
                styles: {
                    name: 'styles',
                    test: /\.(scss|css)$/,
                    chunks: 'all',
                    minChunks: 1,
                    reuseExistingChunk: true,
                    enforce: true
                }
            }
        }
    }
}