/**
 * 
 * @param {*} string 
 * 在一个字符串中，找到字符”a”
 */
/*function findA(string){
    for (var c of string){
        if(c === 'a'){
            return true;
        }
    }
    return false;
}

findA("abs");
findA('ddas');
findA('sddf');*/
/**
 * 不准使用正则表达式，纯粹用 JavaScript 的逻辑实现：在一个字符串中，找到字符“ab”
 * 不准使用正则表达式，纯粹用 JavaScript 的逻辑实现：在一个字符串中，找到字符“ab”
  思路：1 首先在字符串中找到A 如果存在A的状态 设置为 true 默认为flase
       2 如果Astate ==- true 在寻找B 如果找到B 返回True 否则重制Astate=flase  
 */
function find(string){
    let stateA = false;
    for(let c of string){
        
        if(c === 'a'){
            stateA = true;
        }else if(stateA === true && c=== 'b'){
            return true;
        }else{
            stateA = false;
        }
    }
    return false;
}

find("advsdf");//false
find('daabcd'); //true