const css = require('css');
const EOF = Symbol('EOF'); //end of flie
const layout = require('./layout.js');

let currentToken = null;
let currentAttribute =null;


let stack = [{type: "documnet",children:[]}];
let currentTextNode = null;

// 加入一个新的函数，addCSSRules 把css规则暂存到一个数组里
let rules = [];

// specificity
function specificity(selector){
    let p=[0, 0, 0, 0];
    let selectorParts =selector.split(' ');

    for(let part of selectorParts){
        if(part.charAt(0) === "#"){
            p[1] += 1;
        }else if(part.charAt(0) === "."){
            p[2] += 1;
        }else{
            p[3] += 1;
        }
    }

    return p;
}

function compare(sp1,sp2){
    if(sp1[0] - sp2[0])
        return sp1[0] - sp2[0];
    if(sp1[1] - sp2[1])
        return sp1[1] -sp2[1]
    if(sp1[2] - sp2[2])
        return sp1[2] -sp2[2]

    return sp1[3] -sp2[3]
}

// 增加样式
function addCSSRules(text){
    var ast = css.parse(text);
    // console.log(JSON.stringify(ast,null ," "));
    rules.push(...ast.stylesheet.rules);
}
/**
 * 
 * @param {*} element  
 * @param {*} selector .a #a a
 *  div.a 复合选择器 正则拆分selector 扩展 match函数 
 */

function match(element, selector){
    if(!selector || !element||!element.attributes)
        return false;
    // TODO：实现复合选择器
    if(selector.charAt(0) == "#"){
        var attr = element.attributes.filter(attr => attr.name === "id")[0];
        if(attr && attr.value === selector.replace("#", ''))
            return true;
    }else if(selector.charAt(0) == "."){
        var attr = element.attributes.filter(attr => attr.name === "class")[0];
        if(attr && attr.value === selector.replace(".", ''))
            return true;
        // TODO: <div class="cls1 cls2"> 匹配多个class的情况（遍历for）
    }else{
        if(element.tagName === selector){
            return true;
        }
    }
    return false;
}
// computeCSS
function computeCSS(element){
    // console.log(rules);
    // console.log(`compute css for Element:${element}`)
    /**
     * 获取父元素序列
     * slice() 复制一边stack内元素
     * .reverse() 标签匹配从当前元素相符元素匹配 div div #myid
     *  var element =stack.slice().reverse();
     */
    var elements =stack.slice().reverse();

    if(!element.computedStyle)
        element.computedStyle ={};

   for (let rule of rules){
       var selectorParts =rule.selectors[0].split(" ").reverse();

        // console.log(selectorParts);
       if(!match(element,selectorParts[0]))
            continue;

        let matched =false;
         // 下边这个循环是匹配css父元素规则的算法
        // elements数组是当前元素的父元素列表的队列，用父元素逐层匹配复杂选择器拆分后的单个选择器的列表，匹配到的话j加1，
        // 如果最后把选择器拆分列表走完了（也就是j>=selectorParts.length），那就说明这条css rule匹配成功。
        var j=1;
        for(var i=0;i<elements.length;i++){  
            if(match(elements[i],selectorParts[j])){
                
                console.log('====',elements[i],selectorParts[j])
                j++;
            }
        }

        if(j >= selectorParts.length){
            matched = true;
        }
        // console.log("matched");
        if(matched){
            var sp = specificity(rule.selectors[0]);
            //若匹配到 加入
            var computedStyle = element.computedStyle;
            for(let declaration of rule.declarations){
                if(!computedStyle[declaration.property])
                    computedStyle[declaration.property] ={}
                
                // computedStyle[declaration.property].value = declaration.value;
                // 运用优先级
                if(!computedStyle[declaration.property].specificity){
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }else if(compare(computedStyle[declaration.property].specificity,sp) < 0){
                    computedStyle[declaration.property].value = declaration.value;
                    computedStyle[declaration.property].specificity = sp;
                }
                     
            }
            // console.log(element.computedStyle);
        }
   }
}
// 复合选择器 选作

function emit(token){
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
        // 添加computeCSS调用
        computeCSS(element);

        top.children.push(element);
        // element.parent = top;

        if(!token.isSelfClosing)
            stack.push(element);
        currentTextNode = null;
    }else if(token.type == "endTag"){
        // console.log(top.tagName+'======'+token.tagName)
        if(top.tagName != token.tagName){
            console.log(top.tagName+'======'+token.tagName)
            throw new Error("Tag start end dosen't match!");
        }else{
            // 通过style标签，执行添加css规则属性
            if(top.tagName === "style"){
                addCSSRules(top.children[0].content);
            }
            /*
            因为Flex布局需要知道子元素的，可以认为子元素一定在标签结束标签前 
 
            */
            layout(top);  
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
        // console.log(currentTextNode.content);
    }

}



function data(c){
    if(c == "<"){
        return tagOpen;
    }else if(c == EOF){
        emit({
            type:"EOF"
        });
        return ;
    }else {
        emit({
            type:"text",
            content:c
        });
        return data;
    }
}

function tagOpen(c){
    if(c ==  "/"){
        return endTagOpen;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken ={
            type:"startTag",
            tagName:""
        }
        return tagName(c);
    }else{
        return ;
        // 这时应该是缺少“>”的错误状态，文档规定的容错方式是把之前的“<”当成文本节点，emit一个“>”字符，然后进入Data state。
        // 涉及修改上个TagOpen状态为Text状态，比较复杂，在Toy-Browser里暂时不处理。
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
         return selfClosingStartTag;
     }else if(c.match(/^[a-zA-Z]$/)){
         currentToken.tagName += c//.toLowerCase();
         return tagName;
     }else if(c == ">"){
         emit(currentToken);
         return data;
     }else{
        currentToken.tagName += c;
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
         emit(currentToken);
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
{/* <div id="ad" class=""></div> */}
function afterQuoteAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c == "/"){
        return selfClosingStartTag;
    }else if( c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
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
        emit(currentToken);
        return data;
    }else if(c == "\u0000"){

    }else if(c == "\"" || c == "\'" || c == "<" || c == "="  || c == "`"){

    }else if(c == EOF){

    }else{
        currentAttribute += c;
        return UnQuotedAttributeValue;
    }
}

/* <img / */
function selfClosingStartTag(c){
    if(c === ">"){
        currentToken.isSelfClosing = true;
        emit(currentToken)
        return data;
    }else if(c == EOF){

    }else{

    }
}

// 占位函数
module.exports.parseHTML = function parseHTML(html){
//    let state = data;
   let state = data;
   for(let  c of html){
       state =  state(c)
   }
   state = state(EOF)

//    console.log(stack[0]); 
return stack[0];


}    

