//监听和识别
let  element = document.documentElement;

let isListeningMouse = false;

element.addEventListener("mousedown", event =>{
    // console.log(event.button)
    let content = Object.create(null);
    contents.set("mouse" + (1 << event.button), content);
 
    start(event, content);
    let mousemove = event => {
        let button = 1;
        console.log("mousemove",event.buttons)
        while (button <= event.buttons){
            if(button & event.buttons){
                // order of button & button property is not same
                let key;
                if(button  === 2){
                    key = 4;
                }else if(button === 4){
                    key = 2 
                }else{
                    key = button;
                }
                let content = contents.get("mouse" + key);
                move(event, content);
            }
            
            button = button << 1;
        }

        move(event, content);
    }

    let mouseup = event =>{
        console.log("end",event.button);
       let content = contents.get("mouse" + (1 << event.button));
        end(event,content);
        contents.delete("mouse" + (1 << event.button))
        if(event.buttons === 0){
            document.removeEventListener("mousemove",mousemove);
            document.removeEventListener("mouseup", mouseup)
            isListeningMouse = false;

        }
       

    }
    if(!isListeningMouse){
        document.addEventListener("mousemove",mousemove);
        document.addEventListener("mouseup", mouseup)
        isListeningMouse = true;
    }
  
})

let contents = new Map();
element.addEventListener("touchstart", event => {
    for(let touch of event.changedTouches){
        let content = Object.create(null);
        contents.set(touch.identifier, content)
        start(touch, content);
    }

})
element.addEventListener("touchmove", event => {
    for(let touch of event.changedTouches){
        let content = contents.get(touch.identifier);
        move(touch, content);
    }
    
})
element.addEventListener("touchend", event => {
    for(let touch of event.changedTouches){
       let content = contents.get(touch.identifier);
        end(touch, content);
        contents.delete(touch.identifier);
    }
  
})
element.addEventListener("touchcancel", event => {
    for(let touch of event.changedTouches){
        let content = contents.get(touch.identifier);
        cancel(touch, content);
        contents.delete(touch.identifier);
    }
   
})

let handler;
let startX, startY;
let isPan = false, isTap = true, isPress = false;


let start = (point, content) => {
    
    content.startX = point.clientX, content.startY = point.clientY;

    content.isTap = true;
    content.isPan = false;
    content.isPress = false;

    content.handler = setTimeout(() => {
        content.isTap = false;
        content.isPan = false;
        content.isPress = true;
        // 为了防止出问题
        content.handler = null;
        console.log("press");
        
    })
}
let move = (point, content) => {
    let dx = point.clientX - content.startX, dy = point.clientY - content.startY;
    let d = dx ** 2 + dy **2;
    if(!content.isPan && d >100){
        content.isPan = true;
        content.isTap = false;
        content.isPress = false;
        console.log("panstart");
        clearTimeout(content.handler);
    }
    if(content.isPan){
        console.log(dx,dy);
        console.log("pan")
    }
    
}
let end = (point, content) => {
    // debugger
   
    if(content.isTap){
        console.log("tap")
        clearTimeout(content.handler);
    }
    if(content.isPan){
        console.log("panend")
    }
    if(content.isPress){
        console.log("pressend")
    }

}
let cancel = (point, content) => {
    clearTimeout(content.handler);
    console.log("cancle", point.clientX, point.clientY)
}