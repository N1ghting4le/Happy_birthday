const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },

    module: {
        rules: [
            { test: /\.js$/, use: 'babel-loader', exclude: /(node_modules|bower_components)/ },
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './src/styles',
                    to: 'styles'
                },
                {
                    from: './src/favicon.ico',
                    to: 'favicon.ico'
                }
            ]
        })
    ],
    
    devServer: {
        static: {
            directory: path.join(__dirname, 'build'),
        },
        open: true,
    },
    
    mode: 'production',
};