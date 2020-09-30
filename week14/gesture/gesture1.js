let  element = document.documentElement;

element.addEventListener("mousedown", event =>{
    // console.log("mousedown");
    start(event);
    let mousemove = event => {
        // console.log("mousemove");
        // console.log(event.clientX,event.clientY)
        move(event);
    }

    let mouseup = event =>{
        // console.log("mouseup");
        end(event);
        element.removeEventListener("mousemove",mousemove);
        element.removeEventListener("mouseup", mouseup)

    }
    element.addEventListener("mousemove",mousemove);
    element.addEventListener("mouseup", mouseup)
})

element.addEventListener("touchstart", event => {
    for(let touch of event.changedTouches){
        // console.log("start", touch.clientX, touch.clientY)
        start(touch);
    }
    // console.log(event.changedTouches);
})
element.addEventListener("touchmove", event => {
    for(let touch of event.changedTouches){
        // console.log("move", touch.clientX, touch.clientY)
        move(touch);
    }
    // console.log(event.changedTouches);
})
element.addEventListener("touchend", event => {
    for(let touch of event.changedTouches){
        // console.log("end", touch.clientX, touch.clientY)
        end(touch);
    }
    // console.log(event.changedTouches);
})
element.addEventListener("touchcancel", event => {
    for(let touch of event.changedTouches){
        // console.log("cancel", touch.clientX, touch.clientY)
        cancel(touch);
    }
    // console.log(event.changedTouches);
})

let start = (point) => {
    console.log("start",point.clientX, point.clientY)
}
let move = (point) => {
    console.log("move",point.clientX, point.clientY)
}
let end = (point) => {
    console.log("end",point.clientX, point.clientY)
}
let cancel = (point) => {
    console.log("cancle", point.clientX, point.clientY)
}