const EOF = Symbol('EOF');

let stack;
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

function emit(token) {
    let top = stack[stack.length - 1]

    if (token.type == 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }

        element.tagName = token.tagName

        for (let p in token) {
            if (p != 'type' && p != 'tagName') {
                element.attributes.push({
                    name: p,
                    value: token[p]
                })
            }
        }

        top.children.push(element)
        // element.parent = top

        if (!token.isSelfClosing) {
            stack.push(element)
        }
        
        currentTextNode = null
    } else if (token.type == 'endTag') {
        if (top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!")
        }
        currentTextNode = null
    } else if (token.type == 'text') {
        if (currentTextNode == null) {
            currentTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTextNode)
        }
        currentTextNode.content += token.content
    }
}

// 匹配的标签类型 开始标签 | 结束标签 | 自封闭标签
function data(c) {
    if (c === "<") {
        return tagOpen;
    } else if (c == EOF) {
        emit({
            type: 'EOF'
        });
        return;
    } else {
        emit({
            type: 'text',
            content: c
        });
        return data
    }
}

function tagOpen(c) {
    if (c === "/") {
        // 匹配结束标签 左尖括号之后紧跟 '/'
        return endTagOpen
    } else if (c.match(/^[a-zA-Z]$/)) {
        // 如果匹配到英文字母 则为开始标签或自封闭标签
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(c)
    } else {
        emit({
            type: "text",
            content: c,
        })
        return data
    }
}

function endTagOpen(c) {
    if (c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
         return tagName(c)
    } else if (c == '>') {

    } else if (c == EOF) {

    } else {

    }
}

function tagName(c) {
    // 匹配到空格 说明后面其后是属性 <html prop ... 
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
        // 匹配到 '/' 说明为自封闭标签 <hr/>
    } else if (c == "/") {
        return selfClosingStartTag
        // 若匹配英文字符 意味着当前标签名称匹配尚未结束 将字符追加到当前tagName中
    } else if (c.match(/^[A-Z]$/)) {
        currentToken.tagName += c
        return tagName
        // 普通的开始标签
    } else if (c == ">") {
        emit(currentToken);
        return data
    } else {
        currentToken.tagName += c
        return tagName
    }
}

// 处理属性
function beforeAttributeName(c) {
    // 即将开始处理属性 <html prop... 
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
        // 属性已结束
    } else if (c == "/" || c == ">" || c == EOF) {
        return afterAttributeName(c)
        // 属性不会以 '=' 开头 不予处理
    } else if (c == "=") {

    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        return attributeName(c)
    }
}

function attributeName(c) {
    // 属性结束
    if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
        return afterAttributeName(c)
        // 进入属性value处理逻辑 id="tag"
    } else if (c == "=") {
        return beforeAttributeValue
    } else if (c == "\u0000") {

    } else if (c == "\"" || c == "'" || c == "<") {

    } else {
        currentAttribute.name += c
        return attributeName
    }
}

function beforeAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
        return beforeAttributeValue
    } else if (c == "\"") {
        return doubleQuotedAttributeValue
    } else if (c == "\'") {
        return singleQuotedAttributeValue
    } else if (c == '>') {

    } else {
        return UnquotedAttributeValue(c)
    }
}

function doubleQuotedAttributeValue(c) {
    if (c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if (c == '\u0000') {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c
        return doubleQuotedAttributeValue
    }
}

function afterQuotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName
    } else if (c == "/") {
        return selfClosingStartTag
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c == EOF) {

    } else {
        throw new Error('unexpected charater \"' + c + '\"')
    }
}

function singleQuotedAttributeValue(c) {
    if (c == "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return afterQuotedAttributeValue
    } else if (c == '\u0000') {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c
        return singleQuotedAttributeValue
    }
}

function UnquotedAttributeValue(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value
        return beforeAttributeName
    } else if (c == "/") {
        currentToken[currentAttribute.name] = currentAttribute.value
        return selfClosingStartTag
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c == '\u0000') {

    } else if (c == '\"' || c == "'" || c == '<' || c == '=' || c == '`') {

    } else if (c == EOF) {

    } else {
        currentAttribute.value += c
        return UnquotedAttributeValue
    }
}

function afterAttributeName(c) {
    if (c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName
    } else if (c == "/") {
        return selfClosingStartTag
    } else if (c == "=") {
        return beforeAttributeValue
    } else if (c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value
        emit(currentToken)
        return data
    } else if (c == EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(c)
    }
}

function selfClosingStartTag(c) {
    // 标签关闭
    if (c == '>') {
        currentToken.isSelfClosing = true
        emit(currentToken)
        return data
    } else if (c == 'EOF') {

    } else {

    }
}

export function parseHTML(html) {
    
    stack = [{ type: 'document', children: [] }];
    currentToken = null;
    currentAttribute = null;
    currentTextNode = null;
    
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    return stack[0]
}