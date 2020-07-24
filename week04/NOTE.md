# 浏览器工作原理
## 1、有限状态机处理字符串

状态机由状态寄存器和组合逻辑电路构成，能够根据控制信号按照预先设定的状态进行状态转移，是协调相关信号动作、完成特定操作的控制中心。有限状态机简写为FSM（Finite State Machine），主要分为2大类：
* 第一类，若输出只和状态有关而与输入无关，则称为Moore状态机
* 第二类，输出不仅和状态有关而且和输入有关系，则称为Mealy状态机  

### 不使用状态机处理字符串代码
 > 在一个字符串中，找到字符”a”   

                function findA(string){ 
                    for (var c of string){
                        if(c === 'a'){
                            return true;
                        }
                    }
                    return false;
                }
>纯粹用 JavaScript 的逻辑实现：在一个字符串中，找到字符“ab”
                function find(string){
                let stateA = false;
                for(let c of string){
                    
                    if(c === 'a'){
                        stateA = true;
                    }else if(stateA === true && c === 'b'){
                        return true;
                    }else{
                        stateA = false;
                    }
                }
                return false;
            }
>用 JavaScript 的逻辑实现：在一个字符串中，找到字符“abcdef”

                function find(string){
                    let stateA = false;
                    let stateB = false;
                    let stateC= false;
                    let stateD = false;
                    let stateE = false;
                    for(let c of string){
                        if(c === 'a'){
                            stateA = true;
                        }else if(stateA === true && c === 'b'){
                            stateB = true;   
                        }else if(stateB === true && c === 'c'){
                            stateC = true;
                        }else if(stateC === true && c === 'd'){
                            stateD = true;
                        }else if(stateD === true && c === 'e'){
                            stateE = true;
                        }else if(stateE === true && c === 'f'){
                            return true;
                        }else{
                            stateA = false;
                            stateB = false;
                            stateC= false;
                            stateD = false;
                            stateE = false;
                        }
                    }
                    return false;
                }

                console.log(find("abcdefg")); //true
                console.log(find("abcdfeabcdef")); //true
                console.log(find("abcdfe")); //false
## HTTP请求 | HTTP的协议解析
### 编写一个toy 
>根据Nojs中HTTP协议中的CreateServer
```
                    const server = http.createServer((req, res) =>
                    {
                    res.setHeader('Content-Type', 'text/html');
                    res.setHeader('X-Foo', 'bar');
                    res.writeHead(200,
                        { 'Content-Type': 'text/plain' });
                    res.end('ok');
                    });
```

 >通过查询HTTP rfc2612:<https://tools.ietf.org/html/rfc2616>可以知道

### Idempotent Methods(常见的methed)
* options
* get
* head
* put
* delete
* trace
* connect

Class Request 查询XMLHttpRequest<https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest>
>XMLHttpRequest（XHR）对象用于与服务器交互。通过 XMLHttpRequest 可以在不刷新页面的情况下请求特定 URL，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容。XMLHttpRequest 在 AJAX 编程中被大量使用。
* XMLHttpRequest.open()
>>XMLHttpRequest.open() 方法初始化一个请求。该方法要从JavaScript代码使用；从原生代码初始化一个请求，使用openRequest()替代。