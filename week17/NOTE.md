测试工具 
一、Mocha mochajs.org
1、新建一个test-demo的空文件夹
npm init
2、全局安装mocha
 sudo install --global mocha

难点：解决add必须写成一个node模块的问题 ？
    主要问题是出现在export上，可以利用babel解决(babeljs.cn/docs/babel-register)
    另一个使用 Babel 的方法是通过 require 钩子（hook）。require 钩子 将自身绑定到 node 的 require 模块上，并在运行时进行即时编译。 这和 CoffeeScript 的 coffee-script/register 类似。

3、安装babel

    安装@babel/core @babel/register
    npm install @babel/core @babel/register --save-dev

    ./node_modules/.bin/mocha --requre  @babel/register
二、jest

三 、code coverage
nyc
1、安装nyc
sudo npm install --save-dev nyc

 sudo ./node_modules/.bin/nyc ./node_modules/.bin/mocha

 1.1 
 ```ruby
    function add(a, b){
        return a + b;
    }

    function mul(a, b){
        return a * b;
    }

    module.exports.add = add;
    module.exports.mul = mul;
 ```
 1.2 test,js
 ```ruby
    var assert = require('assert');

    var add = require('../add.js').add;
    var mul = require('../add.js').mul;

    describe("add funtion testing", function(){
        it('1 + 2 should be 3', function() {
            assert.equal(add(1, 2), 3);
        });

        it('-4 + 2 should be -2', function() {
            assert.equal(add(-4, 2), -2);
        });
        
        it('-4 * 2 should be -8', function() {
            assert.equal(mul(-4, 2), -8);
        });
    })

 ```
  sudo ./node_modules/.bin/nyc ./node_modules/.bin/mocha
 2、带上babel

 2.1package.json 
 ```ruby
 
  "scripts": {
    "test": "mocha --require  @babel/register",
    "coverage": "nyc npm run test"

  }
  ```

  2.2 add.js
   ```ruby
    export function add(a, b){
    return a + b;
    }
    export function mul(a, b){
        return a * b;
    }

  }
  ```

  2.3 test.js
  ```ruby
    var assert = require('assert');
    import {add, mul} from "../add.js"

    describe("add funtion testing", function(){
        it('1 + 2 should be 3', function() {
            // console.log(add(1, 2))
            // console.log(3);
            assert.equal(add(1, 2), 3);
            
        });
        
        
        it('-4 + 2 should be -2', function() {
            assert.equal(add(-4, 2), -2);
        });
        
        it('-4 * 2 should be -8', function() {
            assert.equal(mul(-4, 2), -8);
        });
    })

  ```

3、运行nyc，需要互相给他加一个插件，
插件：@istanbuljs/nyc-config-babel
https://www.npmjs.com/package/@istanbuljs/nyc-config-babel 

命令：
    npm i babel-plugin-istanbul @istanbuljs/nyc-config-babel --save-dev

3.1 .nycrc
```ruby
{
    "extends": "@istanbuljs/nyc-config-babel"
}
```

这是我们写测试用例的时候用 sudo npm run coverage，
业务代码的时候用 sudo npm run test




