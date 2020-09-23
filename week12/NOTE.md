# 组件化
主要的目标就是复用
## 组件的基本概念
组件跟UI相关的东西，它既是模块又是对象，可以以树形结构进行组合，并且还有一定这种模板配置的能力
## 组件和对象有什么区别？
对象： 三大要素有属性(Properties)、方法(Methods)和继承关系(Inherit) 
组件： Properties Methods Inherit Attribute Config & State(状态) Event  lifecycle Children(树形结构的必要性)）
Properties(属性） Attribute(特性 

## jsx 环境配置
1 新建jsx目录 执行npm init  
2、可以使用npx直接使用webpack，也可以使用全局安装webpack-cli的形式，这里采用的是后者:
    sudo cnpm  install -g webpack webpack-cli 
    sudo cnpm  install -g --save-dev webpack

3、安装babel-loader  安装到本地目录
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

tips：
如果main.js中
```ruby
let e = <Div id ="test">
     <span>a</span>
     <span>b</span>
     <span>c</span>
</Div>
```
现行的浏览器中，我们是做一个这个接口去是解决这个问题的 具体的参见main.js

tips：配置webpack-dev-server：
a. webpack-dev-server简介：

是一个小型node.js express服务器
新建一个开发服务器，可以serve我们pack以后的代码，并且当代码更新的时候自动刷新浏览器
启动webpack-dev-server后，你在目标文件夹中是看不到编译后的文件的，实时编译后的文件都保存到了内存当中。
两种自动刷新方式：
iframe mode
在网页中嵌入了一个 iframe ，将我们自己的应用注入到这个 iframe 当中去，因此每次你修改的文件后，都是这个 iframe 进行了 reload
命令行：webpack-dev-server，无需--inline
浏览器访问：http://localhost:8080/webpack-dev-server/index.html
inline mode
命令行：webpack-dev-server --inline
浏览器访问：http://localhost:8080
b. 安装webpack-dev-server
npm install webpack-dev-server --save-dev
可在项目根目录下安装（不加-g，在项目根目录出现node_modules文件夹，内含webpack-dev-server及其依赖包），也可全局安装（加-g 必须sudo）

c. 在webpack.config.js中添加配置