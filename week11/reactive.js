let callbacks = new Map();
let usedReactivties = [];
// a: {b:3},
let object = {
    a: 3,
    b: 2
}

let po =reactive(object);
// 事件监听vue
effect(() => {
    // console.log(po.a.b);
    console.log(po.a)
})

function effect(callback){
    // callbacks.push(callback);
    usedReactivties = [];
    callback();  
    // 查看是否正确收集到依赖关系
    console.log(usedReactivties);

    for (let reactivity of usedReactivties){
        if(!callbacks.has(reactivity[0])){
            callbacks.set(reactivity[0], new Map());
        }

        if(! callbacks.get(reactivity[0]).has(reactivity[1])){
            callbacks.get(reactivity[0]).set(reactivity[1], []);
        }

        callbacks.get(reactivity[0]).get(reactivity[1]).push(callback);
    }
}



function reactive(object){
    return new Proxy(object, {
        set(obj, prop, val){
            obj[prop] = val;
            if(callbacks.get(obj))
                if(callbacks.get(obj).get(prop))
                    for( let callback of callbacks.get(obj).get(prop)){
                    callback();
                    // console.log(callback);
                }
            
            return obj[prop];
        },
        get(obj, prop){
            // console.log(obj, prop);
            usedReactivties.push([obj, prop])
            return obj[prop]; 
        } 

    })

}


po.a =2;
