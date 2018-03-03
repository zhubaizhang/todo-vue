/** 
 * webpack.config.js 是帮助我们打包前端资源(js,css,img,字体)
 * 
*/
//path 是 nodejs 里面的基准包
const path = require("path");
//引用，使之有html来容纳这编译后的文件
const HTMLPlugin = require("html-webpack-plugin");
const webpack = require('webpack');
/**
 * 非javascript代码单独打包成静态资源文件
 * 这些文件我们要做浏览器缓存
 * npm i extract-text-webpack-plugin
 */
const ExtractPlugin = require('extract-text-webpack-plugin')
//判断是否为开发环境，启动脚本的时候设置的环境变量全部都存在: process.env 这个对象中
const isDev = process.env.NODE_ENV === "development"
const config = {
    target: 'web',//webpack编译目标是web平台
    //入口文件，路径相对于本文件所在的位置，可以写成字符串、数组、对象
    //__dirname 根目录
    entry: path.join(__dirname, 'src/index.js'),
    //输出配置
    output: {
        filename: 'bundle.[hash:8].js',
        // 输出文件，路径相对于本文件所在的位置，打包正式文件，需要发布
        path: path.join(__dirname, 'dist')
    },
    //模块加载器
    module: {
        //用来处理在入口文件中require的和其他方式引用进来的文件，test是正则表达式，匹配要处理的文件；loader匹配要使用的loader，"-loader"可以省略；include把要处理的目录包括进来，exclude排除不处理的目录       
        rules: [
            {
                //使用vue-loader 加载 .vue 结尾的文件
                test: /\.vue$/,//检测文件结尾
                loader: 'vue-loader'
            }, {
                //将js转为ES5
                test: /\.js$/,
                loader: 'babel-loader'
            }, {
                test: /\.jsx$/,//jsx是React写法，vue同样具备，将html写再javascript中
                loader: 'babel-loader'
            }, {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,//将小的图片生成base64引用
                            name: '/static/images/[name]-todo.[ext]'//指定输出文件名字，且绝对路径
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // new webpack.ProvidePlugin({
        //     $:"jquery",
        //     jQuery:"jquery",
        //     "window.jQuery":"jquery"
        // }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'//区别开发环境和正式环境进行打包
            }

        }),
        new HTMLPlugin({//根目录的index.html生成dist下的html，可以多个生成
            //favicon: './src/images/favicon.ico', //favicon路径，通过webpack引入同时可以生成hash值
            filename: 'index.html',
            template: 'index.html',
            inject: 'body',           //script标签的放置
            title: '首页',
            minify: {                    //html压缩
                removeComments: true,     //移除注释
                collapseWhitespace: true //移除空格
            }
        })
    ]
}
if (isDev) {
    config.module.rules.push(
        //我们没有用到css，所以直接去掉
        // {
        //     test:/\.css$/,
        //     use:[
        //         'style-loader',
        //         'css-loader'
        //     ]
        // },
        {
            test: /\.styl/,
            use: [
                'style-loader',
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                },
                'stylus-loader'//使用这个，会自动生成sourceMap
            ]
        }
    );
    config.devtool = '#cheap-module-eval-source-map';//帮助我们在页面上面调试代码的，es6在浏览器不能运行
    //devServer 是在webpack2中才加入这个配置的，在1中要手动去判断
    config.devServer = {
        port: 8000,//端口号
        host: '0.0.0.0',//设置成这个好处是同时可以通过：127.0.0.1/locahost/局域网IP访问
        overlay: {
            errors: true//在编译的时候有任何的错误都在网页上显示出来
        },
        //open:true//启动webpack自动帮忙启动浏览器
        hot: true//热更新，无需刷新页面，直接修改单应用页面内容
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),//启动热加载的组件，正常情况下页面要处理整个热加载的过程，但vue-loader已经帮我们处理了，其他框架除外
        new webpack.NoEmitOnErrorsPlugin()//不是很重要，但是可以减少一些我们不需要的展示问题
    )
} else {//正式环境
    // const UglifyjsPlugin = require('uglifyjs-webpack-plugin');
    //因为每次打包结果可能都不一样，所以每次打包之前需要手动删除dist文件夹
    //npm i clean-webpack-plugin
    var CleanWebpackPlugin = require("clean-webpack-plugin");
    /**
     * 单独打包类库和第三方插件代码
     * 
     * 由于业务代码会经常更新，所有要将它跟类库和第三方插件代码区分开
     * 如果将业务代码和类库代码打包一起会随着业务代码更新而更新
     * 这样类库代码就不能很长时间在浏览器中缓存
     *
     * 希望利用浏览器的缓存来减少服务器的流量以及用户加载速度更快
     */
    config.entry = {//安全
        app: path.join(__dirname, 'src/index.js'),
        vendor: ['vue']//比如：vue-router 可以加进去
    }
    /**
     * 不能使用hash打包，如果使用了，那么打包的hash是一样的
     * chunkhash 理解为：在安全里面申明的不同的节点
     * 异步加载的时候，每个节点单独 chunkhash，使用hash打包，所有打包出来的模块都是同样的。是整个应用的hash
     * 
     * js 文件指定到static/js目录下，vendor 和 runtime 类库就不要再设定指定目录
     */
    config.output.filename = 'static/js/[name].[chunkhash:8].js'
    config.module.rules.push({
        test: /\.styl/,
        use: ExtractPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        minimize: true//压缩css
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true
                    }
                },
                'stylus-loader'//使用这个，会自动生成sourceMap
            ]
        })
    })
    config.plugins.push(
        //对require("style.css")，单独打包css样式
        new ExtractPlugin('static/css/styles.[name].[contentHash:8].css'),
        //单独打包类库
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            //filename: 'vendor-[chunkhash:8].min.js',
        }),
        //将js进行压缩
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: false,
            }
        }),
        /**
         * 
         * 将webpack相关代码单独打包一个文件里面
         * 必须放到 vendor 单独打包后面，不然没有意义，失去对应的作用
         * 
         * 好处：在有新的模块加入的时候，webpack是会给每一个模块加一个ID上去
         * 然后有新的模块加入的时候，有可能插入的顺序是中间，会导致后面的每个模块id都发生变化，会导致打包出来的内容hash产生变化
         * 那么我们想利用hash使浏览器长缓存的作用失去效果
         */
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'//在安全里面没有申明过的
        }),
        //因为每次打包结果可能都不一样，所以每次打包之前需要手动删除dist文件夹
        new CleanWebpackPlugin(['dist'], {
            root: __dirname,
            verbose: true,
            dry: false
        })
    )
}
module.exports = config;