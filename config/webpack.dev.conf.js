const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base.conf'); // 引入公用的config

module.exports = merge(baseWebpackConfig, {
    // 模式
    mode: 'development',
    // 调试工具
    devtool: 'cheap-module-source-map',
    // 开发服务器
    devServer: {
        static: false, // 默认 dev-server 会为根文件夹提供本地服务器，如果想为另外一个目录下的文件提供本地服务器，应该在这里设置其所在目录，设置为 false 禁用
        historyApiFallback: true, // 在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        open: true, // 自动打开浏览器
        compress: true, // 启用gzip压缩
        hot: true, // 模块热更新，自动添加了HotModuleReplacementPlugin，也无需在启动时添加参数
        host: '127.0.0.1', // 设置默认监听域名，如果省略，默认为“localhost”
        port: 8080, // 设置默认监听端口，如果省略，默认为“8080”
        devMiddleware: {
            stats: 'errors-only', // 控制终端仅打印 error
        },
        client: {
            logging: 'error', // 控制浏览器控制台显示的信息
            overlay: true, // Shows a full-screen overlay in the browser when there are compiler errors or warnings
            progress: true, // 将运行进度输出到控制台
        },
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite: { '^/api': '' },
                changeOrigin: true,
            },
        },
    },
    // 插件
    plugins: [
    ],
    optimization: {
        nodeEnv: 'development',
    },
    // 代码模块路径解析的配置
    resolve: {
        // 自动添加模块后缀名
        extensions: ['.tsx', '.ts', '.wasm', '.mjs', '.js', '.json'],
        alias: {
            '@src': path.resolve(__dirname, '../src'),
            '@components': path.resolve(__dirname, '../src/components'),
            '@utils': path.resolve(__dirname, '../src/utils'),
            '@constant': path.resolve(__dirname, '../src/constant'),
        },
    },
});
