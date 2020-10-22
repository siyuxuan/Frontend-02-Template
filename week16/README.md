#工具链注意点 
1、webpack.config.js 文件中
```ruby
    new CopyPlugin({
                patterns: [
                { from: 'src/*.html', to: '[name].[ext]' },
                ],
         }), 
```

如果to 直接写文件地址to: "./" , 目标文件会把src也带上，所以 to: '[name].[ext]' 这样的话只是把文件名*.html放在根目录下

2、 webpack  多文件合并
安装webpack 需要安装两个包，一个是webpack-cli 和 webpack 一般我们初始化一个项目，安装webpack 是会把webpack-cli从webpack的依赖中去掉的。
如何做一个全新的安装？
两种方法，
一种是不安装webpack-cli，使用npx webpack
sudo cnpm uninstall -g webpack-cli
sudo cnpm uninstall -g webpack


一种是全局安装webpack-cli: npm install -g "webpack-cli"  sudo cnpm install -g webpack

3、 webpack.config.js

4、bable 作用 把一个新版本的js编译成一个老版本的版本https://babeljs.io/docs/en/usage


babelrc 