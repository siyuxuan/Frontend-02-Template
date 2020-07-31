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

    var mainSize, mainStart, mainEnd, mainSign, mainBase, 
        crossSize, crossStart, crossEnd, crossSign, crossBase;
    
    if(style.flexDirection === 'row'){
        mainSize = 'width';//主轴尺寸
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if(style.flexDirection === 'row-reverse'){
        mainSize = 'width';//主轴尺寸
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if(style.flexDirection === 'column'){
        mainSize = 'height';//主轴尺寸
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if(style.flexDirection === 'column-reverse'){
        mainSize = 'height';//主轴尺寸
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
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


    /*
    收集元素进行
    1、根据主轴元素，把元素分进行
    2、若设置了no-wrap，则强行分配进行
    */

    // 如果父元素没有设置主轴尺寸 那么那就进入AtuoMainSize模式 
    let isAutoMainSize = false;
    if(!style[mainSize]){ //Auto sizing
        elementStyle[mainSize] = 0;
        for(let i = 0 ;i<items.length; i++){
            let item = items[i];
            if(itemStyle[mainSize] !== null || itemStyle[mainSize] === item[mainSize])
                elementStyle[mainSize] = elementStyle[mainSize]+item[mainSize];
        }
        isAutoMainSize = true; 
        // style.flexWrap =  'nowrap';
    }

    var flexLine = [];
    var flexLines =[flexLine];

    var mainSpace = elementStyle[mainSize];
    var crossSpace = 0;
    for(let i=0; i<items.length; i++){
        var item = items[i];
        var itemStyle = getStyle(item);

        if(itemStyle[mainSize] === null){
            itemStyle[mainSize] =0;
        }

        if(itemStyle.flex){
            flexLine.push(item);
        }else if(style.flexWrap === 'nowrap' && isAutoMainSize){
            mainSize -= itemStyle[mainSize];
            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)){
                crossSpace = Math.max(crossSpace,itemStyle[crossSize]);
            flexLine.push(item);
            }
        }else{
            if(itemStyle[mainSize]>style[mainSize]){
                itemStyle[mainSize] = style[mainSize];
            }

            if(mainSpace < itemStyle[mainSize]){
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            }else{
                flexLine.push(item)
            }

            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
                mainSize -= itemStyle[mainSize];
        }
    }
    flexLines.mainSpace = mainSpace;

    console.log(items);
}

module.exports = layout;