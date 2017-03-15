var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    bail: true,
    devtool: "eval",
    context: path.resolve(__dirname),
    entry: {
        app: './Library/App'
    },
    output: {
        path: path.join(__dirname, 'Distribution/'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: 'Fonts/',
                        outputPath: 'Fonts/',
                    }
                }
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true,
            compress: {
              warnings: true
            }
        })
    ]
};