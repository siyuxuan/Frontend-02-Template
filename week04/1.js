/**
 * 
 * @param {*} string 
 * 用状态机实现：字符串“abcabx”的解析
 */
function match(string){
    let state = start;
    for(let c of string){
        state = state(c);
    }
  
    return state === end;
}
function start(c){
    if(c === "a")
        return FoundA;
    else
        return start;
}
function end(c){
    return end;
}
function FoundA(c){
    if(c === 'b')
        return FoundB;
    else 
    return start(c);
}

function FoundB(c){
    if(c === 'c')
        return FoundC;
    else 
       return start(c);
}

function FoundC(c){
    if(c === 'a')
        return FoundA2;
    else 
    return start(c);
}

function FoundA2(c){
    if(c === 'b')
        return FoundB2;
    else 
    return start(c);
}

function FoundB2(c){
    if(c === 'x')
        return end;
    else 
     return FoundB(c)
}

 
// console.log(match("abcdfeabcdef")); //true
console.log(match("abcabx"));

