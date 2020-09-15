# 组件化
主要的目标就是复用
## 组件的基本概念
组件跟UI相关的东西，它既是模块又是对象，可以以树形结构进行组合，并且还有一定这种模板配置的能力
## 组件和对象有什么区别？
对象： 三大要素有属性(Properties)、方法(Methods)和继承关系(Inherit) 
组件： Properties Methods Inherit Attribute Config & State(状态) Event  lifecycle Children(树形结构的必要性)）
Properties(属性） Attribute(特性 

## jsx 环境配置
`1 新建jsx目录 执行npm init  
2、可以使用npx直接使用webpack，也可以使用全局安装webpack-cli的形式，这里王牌采用的是后者:sudo cnpm  install -g webpack webpack-cli
3、安装babel-loader 
sudo cnpm install --save-dev webpack babel-loader
4、新建webpack.config.js
```ruby
module.exports = {
    entry: "./main.js"
}
```
5、新建main.js
```ruby
for(let i of [2, 3, 4, 5]){
    console.log(i);
}
````
6、我们到terminal中运行一下webpack

## 安装bebel 
1、安装babel-core 和 babel-preset-env
sudo cnpm install --save-dev @babel/core @babel/preset-env
2、配置babel 
修改配置文件webpack.config.js
``` ruby
module: {
        rules: [
            {
                test:/\.js$/,
                use:{
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
    
            }
        ]
    }
```
3、运行webpack

4、 为了解决jsx支持添加 @babel/plugin-transform-react-jsx 
sudo cnpm install --save-dev @babel/plugin-transform-react-jsx  
    let a = <div/> 被编译为了React.createElement(\"div\", null);

5、jsx插件允许在plugins中加上一个配置，
```
plugins: [["@babel/plugin-transform-react-jsx",{pragma:"createElement"}]]
```