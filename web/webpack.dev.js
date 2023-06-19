const { merge } = require('webpack-merge');
require('dotenv').config({ path: './.env' }); 
const common = require('./webpack.common.js');
const webpackEnv = process.env.NODE_ENV || 'development';

module.exports = merge(common, {
    mode: webpackEnv,
    devtool: 'inline-source-map',
    devServer: {
        historyApiFallback: true,
        static: './public/',
        compress: true,
        allowedHosts: "all",
        webSocketServer: process.env.NODE_ENV === "production" && false
    },
});