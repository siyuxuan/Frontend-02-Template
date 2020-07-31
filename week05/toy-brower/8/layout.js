function getStyle(element){
    if(!element.style)
        element.style = {};

    // console.log("----style----")；
    for(let prop in element.computedStyle){
        // console.log(prop)
        var p = element.computedStyle.value;
        element.style[prop] = element.computedStyle[prop].value;

        if(element.style[prop].toString().match(/px$/)){
            element.style[prop]  = parseInt(element.style[prop]);
        }
        
        if(element.style[prop].toString().match(/^[0-9\.]+$/)){
            element.style[prop] = parseInt(element.style[prop]);
        }
    }
}

function layout(element){
    if (element.computedStyle)
        return;
    
    // 对style进行预处理
    var elementStyle = getStyle(element);
     
    if(elementStyle.display != "flex")
        return;
    
    var items =element.children.filter(e => e.type === 'element');

    //items.sort 是为了支持order属性
    items.sort((a,b) => {return (a.order || 0) -(b.order || 0)});

    var style = elementStyle;

    // 交叉轴处理

    ['width', 'height'].forEach(size =>{
        if(style[size] === 'auto' || style[size] === ''){
            style[size] = null;
        }
    })
     
    if(!style.flexDirection || style.flexDirection === 'auto')
        style.flexDirection = 'row';
    if(!style.alignItems || style.alignItems === 'auto')
        style.alignItems = 'stretch';
    if(!style.justifyContent || style.justifyContent === 'auto')
        style.justifyContent = 'flex-start';
    if(!style.flexWrap || style.flexWrap === 'auto')
        style.flexWrap = 'nowrap';
    if(!style.alignContent || style.alignContent === 'auto')
        style.alignContent = 'stretch';

    var mainSize, mainStart, mainEnd, mianSign, mainBase, 
        crossSize, crossStart, crossEnd, crossSign, crossBase;
    
    if(style.flexDirection === 'row'){
        mainSize = 'width';//主轴尺寸
        mainStart = 'left';
        mainEnd = 'right';
        mianSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if(style.flexDirection === 'row-reverse'){
        mainSize = 'width';//主轴尺寸
        mainStart = 'right';
        mainEnd = 'left';
        mianSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if(style.flexDirection === 'column'){
        mainSize = 'height';//主轴尺寸
        mainStart = 'top';
        mainEnd = 'bottom';
        mianSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if(style.flexDirection === 'column-reverse'){
        mainSize = 'height';//主轴尺寸
        mainStart = 'bottom';
        mainEnd = 'top';
        mianSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if(style.flexWrap === 'wrap-reverse'){
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    }else{
        crossBase = 0;
        crossSign = 1;
    }
}

module.exports = layout;