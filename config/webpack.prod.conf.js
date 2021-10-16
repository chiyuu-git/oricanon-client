const { merge } = require('webpack-merge');

const baseConfig = require('./webpack.base.conf');

const config = merge(baseConfig, {
    mode: 'production',
    module: {
        rules: [

        ],
    },
    plugins: [

    ],
});

module.exports = config;
