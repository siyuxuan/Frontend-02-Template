let currentToken = null;
let currentAttribute =null;

let stack = [{type: "documnet",children:[]}];
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

}

const EOF = Symbol('EOF'); //end of flie

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



/* <img / */
function selClosingStartTag(c){
    if(c == ">"){
        currentToken.isSelClosing = true;
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

