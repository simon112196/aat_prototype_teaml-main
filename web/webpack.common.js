const path = require('path');
const webpack = require('webpack');
require('dotenv').config({ path: './.env' }); 
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackEnv = process.env.NODE_ENV || 'development';

const KiB = 1024;

module.exports = {
    mode: webpackEnv,
    devtool: 'source-map',

    entry: [
        './src/index.js',
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app-[fullhash].bundle.js',
        publicPath: '/'
    },

    performance: {
        // hints: false,
        maxEntrypointSize: 750 * KiB,
        maxAssetSize: 750 * KiB
    },

    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            {
                test: /\.jsx?$/, use: "babel-loader"
            },
            { test: /\.(ttf|otf)$/, use: 'file-loader', include: '/src/assets/fonts/'},
            { test: /\.(png|gif|jpg)$/, use: 'url-loader' },
            { test: /.svg$/, use: '@svgr/webpack' },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.join('./public/index.html'),
            favicon: path.join("./public/favicon/favicon.ico")
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env)
        })
    ],

    resolve: {
        extensions: [
            '.css',
            '.web.jsx',
            '.web.js',
            '.jsx',
            '.js',
        ],
    },
};