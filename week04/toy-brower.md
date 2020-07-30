# toy-brower 完成DOM 树构建
浏览器工作原理
![week04](/01.png)
## 1、服务端环境准备 (server.js)
```ruby
const http = require('http');

http.createServer((request,response) => {
  let body = [];
  request.on('error',(err) => {
    console.log(error);
  }).on('data' ,(chunk) =>{
    body.push(chunk.toString());
  }).on('end' ,() => {
    body = body.join(' ');
    console.log("body",body);
    response.writeHead(200,{'Content-Type': 'text/html'});
    response.end(`<html lang="en"> <head><title>test</title>
<style>
  *{padding:0;margin:0}
  p{font-size:24px;text-algin:center;}
  </style>
</head>
<body>
  <p>Hello world!</p>
</body>   
</html>`);
  })
  
}).listen(8088);
console.log("server started");
```
## 2、实现一个HTTP的请求(client.js)
* HTTP请求的完全过程<https://blog.csdn.net/ailunlee/article/details/90600174>
**Request的格式**
status line:
* POST / HTTP/1.1   

headers：
* Host: 127.0.0.1 
* Content-Type: application/x-www-form-urlencoded

body:
* field1=aaa&code=x%3D1
 
### 2.1 HTTP请求总结
* 设计一个HTTP请求的类
* content type是一个必要的字段，要有默认值
* body是KV格式
* 不同的content-type影响body的格式

```ruby
const net = require('net');


class Request{
    /**
     * method url=host+port+path
     * body:k/v
     * headers
     */
    constructor(options){
        this.method = options.method || "GET";
        this.host = options.host,
        this.port = options.port || 80,
        this.path = options.path || '/',
        this.body = options.body || {},
        this.headers = options.headers || {};
        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if(this.headers["Content-Type"] === "application/json")
            this.bodyText =JSON.stringify(this.body);
        else if((this.headers["Content-Type"] === "application/x-www-form-urlencoded"))
            this.bodyText =Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');

        this.headers["Content-Length"] = this.bodyText.length;
        // console.log(this.body)

    }
    
//   使用send方法
    send(connection){
       return new Promise((resolve,reject) =>{

       });
    }
        
}
void async function(){
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers: {
            ["x-foo2"]: "customed"
        },
        body:{
            name:"jyy"
        }
    })
    let response = await  .send();
   console.log(response)
   
}(); 
```
###2.2 send函数总结
* 在Request的构造器中收集必要的信息
* 设计一个send函数，把请求真实发送到服务器
* send函数应该是异步的，所以返回Promise
```ruby
//send 函数的编写
 const net = require('net');


class Request{
    /**
     * method url=host+port+path
     * body:k/v
     * headers
     */
    constructor(options){
        this.method = options.method || "GET";
        this.host = options.host,
        this.port = options.port || 80,
        this.path = options.path || '/',
        this.body = options.body || {},
        this.headers = options.headers || {};
        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if(this.headers["Content-Type"] === "application/json")
            this.bodyText =JSON.stringify(this.body);
        else if((this.headers["Content-Type"] === "application/x-www-form-urlencoded"))
            this.bodyText =Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');

        this.headers["Content-Length"] = this.bodyText.length;
        // console.log(this.body)

    }
    
//   使用send方法
    send(connection){
       return new Promise((resolve,reject) =>{
         const parser = new ResponseParser;
         resolve("")
       });
    }
        
}
class ResponseParser{
    constructor(){}
    receive(string){
        for (let i=0; i<string.length;i++){
            this.receiveChar(string.charAt(i));
        }
    }

    receiveChar(char){

    }

}

void async function(){
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers: {
            ["x-foo2"]: "customed"
        },
        body:{
            name:"jyy"
        }
    })
    let response = await  .send();
   console.log(response)
```
**Response的格式**
status line:
* HTTP/1.1 200 OK

headers：
* Content-Type: text/html 
* Date: Mon, 23 Dec 2019 06:46:19 GMT
* Connection: keep-alive
* *ransfer-Encoding: chunked

body:
* 26
* <html><body> Hello World<body></html>
* 0


###2.3发送请求
• 设计支持已有的connection或者自己新建connection
• 收到数据传给parser
• 根据parser的状态resolve Promise
```ruby
toString(){
        /**
         * `POST / HTTP/1.1\r
            Content-Type: application/x-www-form-urlencoded\r
            Content-Length: 8\r
            \r
            name=jyy`)
         */
return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}
\r`;
    }
//   使用send方法
    send(connection){
        return new Promise((resolve,reject) =>{
            const parser = new ResponseParser;
            if(connection){
                connection.write(this.toString());
            }else{
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    // console.log(this.toString())
                    connection.write(this.toString());
                });
            }
           
            connection.on('data', (data) => {
                //console.log(data.toString());
                parser.receive(data.toString());
                if(parser.isFinished){
                    resolve(parser.response);

                    connection.end();
                }

              });
            connection.on('error', (err) => {
                reject(err) ;
                connection.end();
            });
        });
       
    }

```
### 2.4 ResponseParser
* Response必须分段构造，所以我们要用一个ResponseParser来“装配” 
*   ResponseParser分段处理ResponseText，我们用状态机来分析文本
的结构
```ruby
receiveChar(char){
        if(this.current ===  this.WATTING_STATUS_LINE){
            if(char === '\r')
                this.current = this.WATTING_STATUS_LINE_END;
            else
                this.statusLine += char;
        }else if(this.current ===  this.WATTING_STATUS_LINE_END){
            // console.log(string.charAt(i))
            // this.statusLine.push(char);
            if(char === '\n'){
                this.current = this.WATTING_HEADER_NAME;
           }
        }else if(this.current === this.WATTING_HEADER_NAME){
            // console.log(char);
            if(char === ':'){ 
                this.current = this.WATTING_HEADER_SPACE;
                // console.log("///////");
            }else if(char === '\r'){
                this.current = this.WATTING_HEADER_BLOCK_END;
                // console.log("///////");
                if(this.headers['Transfer-Encoding'] === 'chunked'){
                   
                    this.bodyParser = new TrunkedBodyParser();
                }
            }else{
                this.headName += char;
            }
        }else if(this.current === this.WATTING_HEADER_SPACE){
            if(char === ' '){
                this.current = this.WATTING_HEADER_VALUE;
            }else{
                this.statusLine += char;
            }
        }else if(this.current === this.WATTING_HEADER_VALUE){
            if(char === '\r'){
                this.current = this.WATTING_HEADER_LINE_END;
                this.headers[this.headName] = this.headValue;
                this.headName = ''
                this.headValue = ''
            }else{
                this.headValue += char;
            }
        }else if(this.current === this.WATTING_HEADER_LINE_END){
            if(char === '\n'){
                this.current = this.WATTING_HEADER_NAME;
            }
        } else if(this.current === this.WATTING_HEADER_BLOCK_END){
            if(char === '\n'){
                this.current = this.WATTING_BODY;
            }
        }else if(this.current === this.WATTING_BODY){
            //console.log(char)
            this.bodyParser.receiveChar(char); 
            // if(this.current === )
          
        } 
    }
```
### 2.5  BodyParser总结
* Response的body可能根据Content-Type有不同的结构，因此我们会采用子Parser的结构来解决问题
* 以TrunkedBodyParser为例，我们同样用状态机来处理body的格式

```ruby
class ResponseParser{
    constructor(){
        this.WATTING_STATUS_LINE = 0;
        this.WATTING_STATUS_LINE_END = 1;
        this.WATTING_HEADER_NAME = 2;
        this.WATTING_HEADER_SPACE = 3;
        this.WATTING_HEADER_VALUE = 4;
        this.WATTING_HEADER_LINE_END = 5;
        this.WATTING_HEADER_BLOCK_END = 6;  
        this.WATTING_BODY=7;

        this.current = this.WATTING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {}
        this.headName = "";
        this.headValue = "";
        this.bodyParser = null ;
     }
     get isFinished(){
         return this.bodyParser && this.bodyParser.isFinished;
     }
     get response(){
         this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
         return {
             StatusCode:RegExp.$1,
             StatusText: RegExp.$2,
             headers:this.headers,
             body:this.bodyParser.content.join('')
         }
     }

    receive(string){
        for (let i=0; i<string.length;i++){
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char){
        if(this.current ===  this.WATTING_STATUS_LINE){
            if(char === '\r')
                this.current = this.WATTING_STATUS_LINE_END;
            else
                this.statusLine += char;
        }else if(this.current ===  this.WATTING_STATUS_LINE_END){
            // console.log(string.charAt(i))
            // this.statusLine.push(char);
            if(char === '\n'){
                this.current = this.WATTING_HEADER_NAME;
           }
        }else if(this.current === this.WATTING_HEADER_NAME){
            // console.log(char);
            if(char === ':'){ 
                this.current = this.WATTING_HEADER_SPACE;
                // console.log("///////");
            }else if(char === '\r'){
                this.current = this.WATTING_HEADER_BLOCK_END;
                // console.log("///////");
                if(this.headers['Transfer-Encoding'] === 'chunked'){
                   
                    this.bodyParser = new TrunkedBodyParser();
                }
            }else{
                this.headName += char;
            }
        }else if(this.current === this.WATTING_HEADER_SPACE){
            if(char === ' '){
                this.current = this.WATTING_HEADER_VALUE;
            }else{
                this.statusLine += char;
            }
        }else if(this.current === this.WATTING_HEADER_VALUE){
            if(char === '\r'){
                this.current = this.WATTING_HEADER_LINE_END;
                this.headers[this.headName] = this.headValue;
                this.headName = ''
                this.headValue = ''
            }else{
                this.headValue += char;
            }
        }else if(this.current === this.WATTING_HEADER_LINE_END){
            if(char === '\n'){
                this.current = this.WATTING_HEADER_NAME;
            }
        } else if(this.current === this.WATTING_HEADER_BLOCK_END){
            if(char === '\n'){
                this.current = this.WATTING_BODY;
            }
        }else if(this.current === this.WATTING_BODY){
            //console.log(char)
            this.bodyParser.receiveChar(char); 
            // if(this.current === )
          
        } 
    }
}

class TrunkedBodyParser{
    constructor(){
        this.WATTING_LENGTH = 0;
        this.WATTING_LENGTH_LINE_END = 1;
        this.REANING_TRUNK = 2;
        this.WATTING_NEW_LINE =3;
        this.WATTING_NEW_LINE_END = 4;
        
        this.length = 0;
        this.content =[];
        this.isFinished = false;
        this.current = this.WATTING_LENGTH;
    }
    receiveChar(char){
        // console.log(JSON.stringify(char))
        if(this.current === this.WATTING_LENGTH){
            if(char === '\r'){
                // console.log(this.length)
                if(this.length === 0){
                    this.isFinished =true;
                    
                }
                this.current = this.WATTING_LENGTH_LINE_END
            }else{
                this.length *=16;
                this.length += parseInt(char, 16);
            }
        }else if(this.current === this.WATTING_LENGTH_LINE_END){
            if(char === '\n'){
                this.current = this.REANING_TRUNK;
            }
        }else if(this.current === this.REANING_TRUNK){
            this.content.push(char);
            this.length --;
            if(this.length === 0){
                this.current = this.WATTING_NEW_LINE;
            }
            //console.log('REANING_TRUNK',this.length)
        }else if(this.current === this.WATTING_NEW_LINE){
            if(char === '\r'){
                this.current = this.WATTING_NEW_LINE_END;
            }
        }else if(this.current === this.WATTING_NEW_LINE_END){
            if(char === '\n'){
                this.current = this.WATTING_LENGTH;
                //console.log('WATTING_LENGTH')
            }
        }
    }
}
```
## 3、浏览器工作原理--HTML的解析 (parser.js)
### 3.1 拆分文件
* 为了方便文件管理，我们把parser单独拆到文件中
* parser接受HTML文本作为参数，返回一颗DOM树
```ruby
// 占位函数
module.exports.parseHTML = function parseHTML(html){
    console.log(html)
}
```
### 3.2 创建状态机
*html 80个状态 参考网站 https://html.spec.whatwg.org/multipage/parsing.html#tokenization*
* 我们用FSM来实现HTML的分析
* 在HTML标准中，已经规定了HTML的状态
* Toy-Browser只挑选其中一部分状态，完成一个最简版本
```ruby
const EOF = Symbol('EOF'); //end of flie


// 初始状态
function data(c){
    if(c== "<"){
        return tagOpen; //标签开始
    }else if (c== EOF){
        emit({
            type:EOF
        });
        return ;
    }else{
        emit({
            type:'text',
            content:c
        });
        return data;
    }

}
// 占位函数
module.exports.parseHTML = function parseHTML(html){
//    let state = data;
   let state = data;
   for(let c of html){
       state = state(c)
   }
   state = state(EOF)
}    
```
### 3.3 解析标签

主要的标签有：开始标签，结束标签和自封闭标签 这一步我们暂时忽略属性 用状态机去区分这三种标签

```ruby
function data(c){
    if(c == "<"){
        return tagOpen;
    }else if(c == EOF){

        return ;
    }else {

        return data;
    }
}

function tagOpen(c){
    if(c == "/"){
        return endTagOpen;
    }else if(c.match(/^[a-zA-Z]$/)){
        return tagName(c);
    }else{
        return ;
    }
}
function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){

        return tagName(c);
    }else if(c == ">"){

    }else if(c == EOF){

    }else{

    }
}

function tagName(c){
     if(c.match(/^[\t\n\f ]$/)){
         return beforeAttributeName;
     }else if(c == "/"){
         return selClosingStartTag;
     }else if(c.match(/^[a-zA-Z]$/)){
         return tagName;
     }else if(c == ">"){
         return data;
     }else{
         return tagName;
     }
}

function  beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c == "/" || c == ">" || c == EOF){
        // return data;
        return afterAttributeName(c);
    }else if(c == "="){
      
    }else {
        }
        // console.log(`currentAttribute:${currentAttribute}`)
        return attributeName(c);
    }
}
 
function selClosingStartTag(c){
    if(c == ">"){
        currentToken.isSelClosing = true;
        return data;
    }else if(c == EOF){

    }else{

    }
}
```
### 3.4 创建元素(emit(token))
* 在状态机中，除了状态迁移，我们还会要加入业务逻辑
* 我们在标签结束状态提交标签token
#### 3.4.1在头部加入
```ruby
let currentToken = null;
function eimt(token){
    // console.log(token);
}
```
#### 3.4.2  随着状态机一个个的一个个读进字符的时候逐步去构造token中的内容
```ruby
function data(c){
    if(c == "<"){
        return tagOpen;
    }else if(c == EOF){
        eimt({
            type:"EOF"
        });
        return ;
    }else {
        eimt({
            type:"text",
            content:c
        });
        return data;
    }
}

function tagOpen(c){
    if(c == "/"){
        return endTagOpen;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken ={
            type:"startTag",
            tagName:""
        }
        return tagName(c);
    }else{
        return ;
    }
}

function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken ={
            type:"endTag",
            tagName:""
        }
        return tagName(c);
    }else if(c == ">"){

    }else if(c == EOF){

    }else{

    }
}

function tagName(c){
     if(c.match(/^[\t\n\f ]$/)){
         return beforeAttributeName;
     }else if(c == "/"){
         return selClosingStartTag;
     }else if(c.match(/^[a-zA-Z]$/)){
         currentToken.tagName += c//.toLowerCase();
         return tagName;
     }else if(c == ">"){
         eimt(currentToken);
         return data;
     }else{
         return tagName;
     }
}

/* <html 处理属性的状态  */
function  beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c == "/" || c == ">" || c == EOF){
        // return data;
        return afterAttributeName(c);
    }else if(c == "="){
      
    }else {
    //    遇到字符
        currentAttribute = {
            name:"",
            value:""
        }
        // console.log(`currentAttribute:${currentAttribute}`)
        return attributeName(c);
    }
}
function selClosingStartTag(c){
    if(c == ">"){
        currentToken.isSelClosing = true;
        return data;
    }else if(c == EOF){

    }else{

    }
} 
```
### 3.5 处理属性
* 属性值分为单引号、双引号、无引号三种写法，因此需要较多状态处理
* 处理属性的方式跟标签类似
* 属性结束时，我们把属性加到标签Token上
#### 3.5.1 首先定义一个全局变量
```ruby
let currentAttribute =null;
```
#### 3.5.2 处理属性的代码
```ruby
/* <html 处理属性的状态  */
function  beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c == "/" || c == ">" || c == EOF){
        // return data;
        return afterAttributeName(c);
    }else if(c == "="){
      
    }else {
    //    遇到字符
        currentAttribute = {
            name:"",
            value:""
        }
        // console.log(`currentAttribute:${currentAttribute}`)
        return attributeName(c);
    }
}

/* <div class ="d1"  */
function attributeName(c){
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
        return afterAttributeName(c);
    }else if (c == "="){
        return beforeAttributeValue;
    }else if(c == "\u0000"){

    }else if(c == "\""|| c == "'" || c =="<"){

    }else{
        currentAttribute.name += c;
        return attributeName;
    }
}

function afterAttributeName(c){
     if(c.match(/^[/t/n/f ]$/)){
         return afterAttributeName;
     }else if( c == "/"){
         return selClosingStartTag;
     }else if(c == "="){
         return beforeAttributeValue;
     }else if(c = ">"){
         currentToken[currentAttribute.name] = currentAttribute.value;
         eimt(currentToken);
         return data;
     }else if(c == EOF){


     }else{
         currentToken[currentAttribute.name] = currentAttribute.value;
         currentAttribute = {
             name:"",
             value:""
         };
         return attributeName(c);
     }

}

function beforeAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
        return beforeAttributeValue;
    }else if(c == "\""){
        return doubleQuotedAttributeValue;
    }else if(c == "\'"){
        return singleQuotedAttributeValue;
    }else if(c == ">"){
        // return data；
    }else{
        return UnQuotedAttributeValue;
    }
}

function doubleQuotedAttributeValue(c){
    if(c == "\""){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuoteAttributeValue;
    }else if(c == "\u0000"){

    }else if(c == EOF){

    }else{
        currentAttribute.value  += c;
        return doubleQuotedAttributeValue;
    }
}


function singleQuotedAttributeValue(c){
    if(c == "\'"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuoteAttributeValue;
    }else if(c == "\u0000"){

    }else if(c == EOF){

    }else{
        currentAttribute.value  += c;
        // return singleQuotedAttributeValue;
        return doubleQuotedAttributeValue;
    }
}
/* <div id="ad" class=""></div> */
function afterQuoteAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c == "/"){
        return selClosingStartTag;
    }else if( c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        eimt(currentToken);
        return data;
    }else if (c == EOF){

    }else{
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function UnQuotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    }else if(c == "/"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    }else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        eimt(currentToken);
        return data;
    }else if(c == "\u0000"){

    }else if(c == "\"" || c == "\'" || c == "<" || c == "="  || c == "`"){

    }else if(c == EOF){

    }else{
        currentAttribute += c;
        return UnQuotedAttributeValue;
    }
}

```
### 3.6 用token构建DOM树
* 从标签构建DOM树的基本技巧是使用栈
* 遇到开始标签时创建元素并入栈，遇到结束标签时出栈
* 自封闭节点可视为入栈后立刻出栈
* 任何元素的父元素是它入栈前的栈顶
#### 3.6.1  首先定义一个全局的数据结构，push进去一个初始节点doucument节点
```ruby
let stack = [{type: "documnet",children:[]}];
```
#### 3.6.2 emit会接收从状态机中产生的所有token 忽视文本节点
```ruby
function eimt(token){
    // console.log(token);
    let top = stack[stack.length -1];
    if(token.type == "startTag"){
        let element ={
            type:"element",
            children:[],
            attributes:[]
        };

        element.tagName = token.tagName;

        for(let p in token){
            if(p != "type" && p != "tagName")
                element.attributes.push({
                    name:p,
                    value: token[p]
                });
        }
        
        top.children.push(element);
        element.parent = top;

        if(!token.isSelClosing)
            stack.push(element);
        currentTextNode = null;
    }else if(token.type == "endTag"){
        // console.log(top.tagName+'======'+token.tagName)
        if(top.tagName != token.tagName){
            throw new Error("Tag start end dosen't match!");
        }else{
            stack.pop();
        }
        
        currentTextNode = null;
    }else if(token.type == "text"){
       return;
    }
```

*各种状态下如何配对标签 参考链接 https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhtml*
### 3.7 文本节点 

* 文本节点与自封闭标签处理类似
* 多个文本节点需要合并

把eimit中遇到文本节点就return的逻辑去掉，加上一个类型为Text的逻辑，当前处于一个文本节点时，如果没有逻辑节点的话，就创建一个文本节点，定义一个全局变量currentTextNode ，遇到结束一个标签时，开始标签和结束标签currentTextNode清空，但遇到字符型的token时 给当前文本节点追加一个content
```ruby
let currentTextNode = null;

function eimt(token){
    // console.log(token);
    let top = stack[stack.length -1];
    if(token.type == "startTag"){
        let element ={
            type:"element",
            children:[],
            attributes:[]
        };

        element.tagName = token.tagName;

        for(let p in token){
            if(p != "type" && p != "tagName")
                element.attributes.push({
                    name:p,
                    value: token[p]
                });
        }
        
        top.children.push(element);
        element.parent = top;

        if(!token.isSelClosing)
            stack.push(element);
        currentTextNode = null;
    }else if(token.type == "endTag"){
        // console.log(top.tagName+'======'+token.tagName)
        if(top.tagName != token.tagName){
            throw new Error("Tag start end dosen't match!");
        }else{
            stack.pop();
        }
        
        currentTextNode = null;
    }else if(token.type == "text"){
        if(currentTextNode == null){
            currentTextNode = {
                type :"text",
                content:""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
        console.log(currentTextNode.content);
    }
```

**以上完成DOM树构建 不能解析<! doctype html> head 中出现<meta />会出错**