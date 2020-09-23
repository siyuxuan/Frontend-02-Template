var set = new Set();
var globalProperties = ["eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "Object", "Function", "Boolean", "Symbol", "Error", "EvalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError", "Number", "BigInt", "Math", "Date", "String", "RegExp", "Array", "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Uint16Array", "Int32Array", "Uint32Array", "Float32Array", "Float64Array", "BigInt64Array", "BigUint64Array", "Map", "Set", "WeakMap", "WeakSet", "ArrayBuffer", "SharedArrayBuffer", "Atomics", "DataView", "JSON", "Promise", "Reflect", "Proxy", "Intl", "WebAssembly"]
var queue = [];
for (let p of globalProperties){
    queue.push({
        path: p,
        object: this[p] // this -> window/global
    })
}

// 使用递归深度优先查询
let current;
let data = {id: "内置对象", children: []};
while(queue.length){
    current = queue.shift();
    data.children.push(findObject(current));
}

// 编写递归函数findObject
function findObject(objmsg, data){
    let {path: path, object: obj}  = objmsg;

    if(set.has(obj)) return;
    set.add(obj);

    data = data || {};
    data.id = path;

    let PropertyNames = Object.getOwnPropertyNames(obj);    
    if(!PropertyNames.length) return;
    for (let p of PropertyNames){
        let property = Object.getOwnPropertyDescriptor(obj, p);
        
        if( (property.value != null && typeof property.value == "object") || (typeof property.value == "function") ){
            if(!set.has(property.value)){
                let children = data.children = data.children ? data.children : [];   
                let child = children[children.length] = {};
                findObject({path: p, object: property.value}, child);
            }
        }

        if(property.hasOwnProperty("get") && property.get instanceof Object){
            if(!set.has(property.get)){
                let children = data.children = data.children ? data.children : [];   
                let child = children[children.length] = {};
                findObject({path: p, object: property.get}, child);
            }
        }

        if(property.hasOwnProperty("set") && property.set instanceof Object){
            if(!set.has(property.set)){
                let children = data.children = data.children ? data.children : [];    
                let child = children[children.length] = {}; 
                findObject({path: p, object: property.set}, child);
            }
        }

    }
    return data;
}