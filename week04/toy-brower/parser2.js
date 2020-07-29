let currentToken = null;

function emit(token){
    console.log(token);
}

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

function tagOpen(c){
    if(c== '/'){
        return endTagOpen;   
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken =  {
            type:'startTag',
            tagName: ''
        }
        return tagName(c);
    }else{
        return;
    }
}

function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken =  {
            type:'endTag',
            tagName: ''
        }
        return tagName(c);
    }else if(c == '>'){

    }else if(c == EOF){

    }else{

    }
}

function tagName(c){
    if(c.match(/^[\n\t\f ]$/)){
        return beforeAttributeName;
    }else if(c== '/'){
        return selfCloseingStartTag;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName += c; //.toLowerCase();
        return tagName;
    }else if(c== '>'){
        return data;
    }else{
        return tagName;
    }
}

// beforeAttributeName  < html  
function beforeAttributeName(c){
    if(c.match(/^[\n\t\f ]$/)){
        return beforeAttributeName;
    }else if(c== '>'){
        return data;
    }else if(c=='='){
        return beforeAttributeName;
    }else{
        return beforeAttributeName;
    }
}

// selfCloseingStartTag

function selfCloseingStartTag(c){
    if(c=='>'){
        currentToken.isSelfClosing = true;
        return data;
    }else if(C == EOF){

    }else{

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

// 占位函数
/*module.exports.parseHTML = function parseHTML(html){
    console.log(html)
}*/ 