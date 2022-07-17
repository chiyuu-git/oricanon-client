const path = require('node:path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    // 入口起点，从项目的根目录开始读取路径，而不是配置文件所在的config目录
    entry: {
        app: './src/index.tsx',
    },
    // 输出
    output: {
        // 使用了path包，是相对路径，从本文件开始
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[contenthash].js',
        publicPath: '/',
        // webpack 默认通过箭头函数包裹打包内容实现作用域
        environment: {
            arrowFunction: false,
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, '../src'),
                ],
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.less$/,
                include: [
                    path.resolve(__dirname, '../src'),
                ],
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'less-loader',
                        // 支持antd 按需载入
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: 'asset',
                generator: {
                    // [ext]前面自带"."
                    filename: 'assets/[contenthash].[name][ext]',
                },
            },
            {
                test: /\.(tsx|ts|js)$/,
                include: [
                    path.resolve(__dirname, '../src'), // src 目录下的才需要经过 babel-loader 处理
                ],
                options: {
                    // cacheDirectory: true,
                    presets: [
                        ['@babel/env', {
                            useBuiltIns: 'usage',
                            corejs: 3,
                        }],
                        '@babel/preset-react',
                        '@babel/typescript',
                    ],
                    plugins: [
                        [
                            '@babel/plugin-transform-runtime',
                            {
                                'helpers': true, // 默认，可以不写
                                'regenerator': true, // 提供的 不污染全局的 regeneratorRuntime
                                'useESModules': true, // 使用 es modules helpers, 减少 commonJS 语法代码
                            },
                        ],
                        // ['@babel/plugin-proposal-decorators', { legacy: true }],
                        // '@babel/plugin-proposal-class-properties',
                        // ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
                    ],
                },
                loader: 'babel-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html', // 配置输出文件名和路径
            template: 'public/index.html', // 配置文件模板，也就是入口
            inject: 'body', // inject
        }),
        new MiniCssExtractPlugin(),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true,
                },
                mode: 'write-references',
            },
        }),
    ],
};
