function getStyle(element){
    if(!element.style)
        element.style = {};
    
    for(let prop in element.computedStyle){
        element.style[prop] = element.computedStyle[prop].value;

        if(element.style[prop].toString().match(/px$/))
            element.style[prop] = parseInt(element.style[prop]);
        if(element.style[prop].toString().match(/^[0-9\.]+$/))
            element.style[prop] = parseInt(element.style[prop]);
    }
    return element.style;
}
function layout(element){
    if (!element.computedStyle)
        return;
    
    // 对style进行预处理
    let elementStyle = getStyle(element);
     
    if(elementStyle.display !== 'flex')
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
    var isAutoMainSize = false;
    if(!style[mainSize]){ //Auto sizing
        elementStyle[mainSize] = 0;
        for(let i = 0 ;i<items.length; i++){
            let item = items[i];
            if(itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0))
                elementStyle[mainSize] = elementStyle[mainSize]+itemStyle[mainSize];
        }
        isAutoMainSize = true; 
        // style.flexWrap =  'nowrap';
    }

  // TODO: 实现flex-grow、flex-shrink
    var flexLine = []; // 单行
    var flexLines = [flexLine]; // 所有行

    var mainSpace = elementStyle[mainSize]; // 主轴剩余空间
    var crossSpace = 0; // 交叉轴剩余空间

    for(var i = 0; i < items.length; i++){
        var item = items[i];
        var itemStyle = getStyle(item);
    
        if(itemStyle[mainSize] === null){
            itemStyle[mainSize] = 0;
        }
    
        if(itemStyle.flex){
            flexLine.push(item); // 如果有flex属性，表示元素可伸缩，这时无论如何都能放进一行，直接push进去
        }else if(style.flexWrap === "nowrap" || isAutoMainSize){
            // 如果样式为不折行
            mainSpace -= itemStyle[mainSize];
            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]); //交叉轴一行的高度取决于最高的元素的高度
            flexLine.push(item);
        }else{
            if(itemStyle[mainSize] > style[mainSize]){
                // 如果item尺寸超过父元素尺寸，则设置成父元素尺寸
                itemStyle[mainSize] = style[mainSize];
            }
            if(mainSpace < itemStyle[mainSize]){
                // 如果剩余尺寸放不下item，则换行，新建flexLine
                flexLine.mainSpace = mainSize;
                flexline.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            }else{
                flexLine.push(item);
            }
            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
    
            mainSpace -= itemStyle[mainSize];
        }
    }
    flexLine.mainSpace = mainSpace;

  
    // 主轴计算
    flexLines.mainSpace = mainSpace;

    console.log(items + 'mainspace');
    if(style.flexWrap === 'nowrap' || isAutoMainSize){
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize]:crossSpace;
    }else{
        flexLine.crossSpace = crossSpace;
    }

    if(mainSpace  < 0){
        //overflow 单行
        var scale = style[mainSize] /(style[mainSize] - mainSpace);
        var currentMain = mainBase;
        for(let i=0; i<items.length; i++){
            let item =items[i];
            let itemStyle = getStyle(item);

            if(itemStyle.flex){
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign*itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }

    }else{
        // process each flex line
        flexLines.forEach((items) =>{

            var mainSpace = items.mainSpace;
            var flexTotal = 0;

            for(let i=0; i<items.length; i++){
                let item =items[i];
                let itemStyle = getStyle(item);

                if((!itemStyle.flex !== null) && (itemStyle.flex !== (void 0))){
                    flexTotal += itemStyle.flex; //只考虑 flex:1; 这种情况
                  
                }
            }

            if(flexTotal > 0){
                // There id flexible flex items
                let currentMain = mainBase;
                for(let i = 0; i<items.length; i++){
                    let item =items[i];
                    let itemStyle = getStyle(item);

                    if(itemStyle.flex){
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }
        

        
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign*itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            }else{
                // there is no flexible flex item,which means justifyContent
                if(style.justifyContent === 'flex-start'){
                    var currentMain = mainBase;
                    var step = 0;
                }

                if(style.justifyContent === 'flex-end'){
                    var currentMain =mainSpace * mainSign + mainBase;
                    var step = 0;
                }

                if(style.justifyContent === 'center'){
                    var currentMain =mainSpace / 2 * mainSign + mainBase;
                    var step = 0;
                }

                if(style.justifyContent === 'space-between'){
                    var step = mainSpace / (items.length - 1) * mainSign;
                    var currentMain = mainSpace;
                }

                if(style.justifyContent === 'space-around'){
                    var step = mainSpace / items.length * mainSign;
                    var currentMain = step / 2 + mainBase;
                }
                if(style.justifyContent === "space-evenly"){
                    var step = mainSpace / (items.length + 1) * mainSign;
                    var currentMain = step + mainBase;
                }

                for(let i=0; i<items.length; i++){
                    let item = items[i];
                    let itemStyle = getStyle(item);

                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;

                }
            }


        })

    }

    /* 交叉轴的计算：
        根据每一行最大元素尺寸计算行高
        2、根据行高flex-align和item-align 确定元素的具体位置
    */
   var crossSpace;//容器的交叉轴剩余尺寸
//    如果容器元素没写交叉轴尺寸
   if(!style[crossSpace]){ //auto sizing
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for(let i= 0 ; i < flexLines.length; i++){
            // 容器的交叉轴尺寸等于各行交叉轴尺寸之和
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[i].crossSpace;
        }
   }else{
       crossSpace = style[crossSize];
       for(let i = 0;i < flexLines.length ; i++){
           crossSpace -= flexLines[i].crossSpace;
       }
   }

 // 处理flex-wrap，如果是wrap-reverse，交叉轴起点其实就是容器的交叉轴尺寸
   if(style.flexWrap === 'wrap-reverse'){
       crossBase = style[crossSize];
   }else {
       crossBase = 0;
   }
// 处理align-content，确定每行的位置
   var lineSize = style[crossSize] / flexLines.length;
   var step;

   if(style.alignContent === 'flex-start'){
       crossBase += 0;
       step = 0;
   }

   if(style.alignContent === 'flex-end'){
        crossBase += crossSign * crossSpace;
        step = 0;
    }

    if(style.alignContent === 'center'){
        crossBase += crossSign * crossSpace /2;
        step = 0;
    }
    
    if(style.alignContent === 'space-betwwen'){
        crossBase +=0; 
        step = crossSpace / (flexLines.length -1);
    }

    if(style.alignContent === 'space-around'){

        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2;
    }

    if(style.alignContent === 'stretch'){
        crossBase +=0;
        step = 0;
    }
    // 处理 algin-items 和 align-self，确定每个元素在每行里的位置
    flexLines.forEach((items) => {
         // 如果容器align-content是stretch，一行的交叉轴尺寸就等于，
        // 一行自身的的crossSpace加上（容器的crossSpace除以行数（也就是平分了的容器剩余交叉轴空间））
        var lineCrossSize = style.alignContent === "stretch" ? 
        items.crossSpace + crossSpace / flexLines.length :
        items.crossSpace;

        for(let i = 0; i <items.length; i++){
            let item = items[i];
            let itemStyle = getStyle(item);

            let align = itemStyle.alignSelf || style.alignItems;

            if(itemStyle[crossSize] === null)
                itemStyle[crossSize] = (align === 'stretch') ?
                lineCrossSize : 0;
            
         if(align === "flex-start"){
            itemStyle[crossStart] = crossBase;
            itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        }
        if(align === "flex-end"){
            itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
            itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
        }

        if(align === "center"){
            itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
            itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        }


            if(align === 'stretch'){
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0))? itemStyle[crossSize] : lineCrossSize);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
                // itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    })

    // console.log(items+'cross')

}

module.exports = layout;