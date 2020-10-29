const webpack = require('webpack'); //to access built-in plugins
const CopyPlugin = require('copy-webpack-plugin');
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry:"./src/main.js",
    module: {
        rules: [
            { test: /\.vue$/, use: 'vue-loader' },
            // this will apply to both plain `.css` files
            // AND `<style>` blocks in `.vue` files
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options:["@babel/preset-env"]
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new CopyPlugin({
            patterns: [
              { from: 'src/*.html', to: '[name].[ext]' },
            ],
          }), 
    ]
};