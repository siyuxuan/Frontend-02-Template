let  element = document.documentElement;

element.addEventListener("mousedown", event =>{
    start(event);
    let mousemove = event => {
        move(event);
    }

    let mouseup = event =>{
        end(event);
        element.removeEventListener("mousemove",mousemove);
        element.removeEventListener("mouseup", mouseup)

    }
    element.addEventListener("mousemove",mousemove);
    element.addEventListener("mouseup", mouseup)
})

element.addEventListener("touchstart", event => {
    for(let touch of event.changedTouches){
        start(touch);
    }
})
element.addEventListener("touchmove", event => {
    for(let touch of event.changedTouches){
        move(touch);
    }
})
element.addEventListener("touchend", event => {
    for(let touch of event.changedTouches){
        end(touch);
    }
})
element.addEventListener("touchcancel", event => {
    for(let touch of event.changedTouches){
        cancel(touch);
    }
   
})

let handler;
let startX, startY;
let isPan = false, isTap = true, isPress = false;


let start = (point) => {

    startX = point.clientX, startY = point.clientY;

    isTap = true;
    isPan = false;
    isPress = false;

    handler=setTimeout(() => {
        isTap = false;
        isPan = false;
        isPress = true;
        // 为了防止出问题
        handler = null;
        console.log("press");
        
    })
}
let move = (point) => {
    let dx = point.clientX - startX, dy = point.clientY -startY;
    let d = dx ** 2 + dy **2;
    if(!isPan && d >100){
        isPan = true;
        isTap = false;
        isPress = false;
        console.log("panstart");
        clearTimeout(handler);
    }
    if(isPan){
        console.log(dx,dy);
        console.log("pan")
    }
  
}
let end = (point) => {

    if(isTap){
        console.log("tap")
        clearTimeout(handler);
    }
    if(isPan){
        console.log("panend")
    }
    if(isPress){
        console.log("pressend")
    }

}
let cancel = (point) => {
    clearTimeout(handler);
    console.log("cancle", point.clientX, point.clientY)
}