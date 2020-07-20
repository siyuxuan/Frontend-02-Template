//browser实现,返回二进制字节
function UTF8_Encoding(str){
    const codePointArray =  [];
    for(let i in str){
        codePointArray.push(str.codePointAt(i))
    }
    const byteArray = [];
    for(let i of codePointArray){
        byteArray.push(generateBycodePoint(i))
    }
    return byteArray;
}
​
function generateBycodePoint(codePoint){
    console.log(codePoint)
    let str = codePoint.toString(2);
    if(codePoint >= 0x0000 && codePoint <= 0x007f){
        console.log(1)
        return '0' + str.padStart(7,0);
    }else if(codePoint >= 0x0080 && codePoint <= 0x07ff){
        console.log(2)
        //11位
        str = str.padStart(11,0);
        return patch(str);
    }else if(codePoint >= 0x0800 && codePoint <= 0xffff){
        console.log(3)
        //16位
        str = str.padStart(16,0);
        return patch(str);
    }else if(codePoint >= 0x10000 && codePoint <= 0x10ffff){
        //21位
        str = str.padStart(21,0);
        return patch(str);
    }
    return false;
}
​
function patch(binaryStr){
    console.log(binaryStr)
    let resultStr = "";
    const codeLength = binaryStr.length;
    const lastByteNumber = parseInt(codeLength/6);
    const headPatchCode = '1'.repeat(lastByteNumber + 1) + '0';
    const headCodeLength = codeLength - lastByteNumber * 6;
    const headCode = binaryStr.slice(0, headCodeLength);
    const lastCode = binaryStr.slice(headCodeLength);
    resultStr += headPatchCode + headCode;
    for(let i = 0;i < lastCode.length - 5; i += 6){
        if(i % 6 === 0){
            resultStr += '10' + lastCode.slice(i,i + 6);
        }
    }
    return resultStr;
}
​
 console.log(utf8_encoding("我1aA•!~𐀀🪐😀"))