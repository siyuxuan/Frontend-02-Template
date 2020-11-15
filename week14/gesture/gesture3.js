//监听和识别
let element = document.documentElement;

let isListeningMouse = false;

element.addEventListener("mousedown", event => {
    // console.log(event.button)
    let context = Object.create(null);
    contexts.set("mouse" + (1 << event.button), context);

    start(event, context);
    let mousemove = event => {
        let button = 1;
        console.log("mousemove", event.buttons)
        while (button <= event.buttons) {
            if (button & event.buttons) {
                // order of button & button property is not same
                let key;
                if (button === 2) {
                    key = 4;
                } else if (button === 4) {
                    key = 2
                } else {
                    key = button;
                }
                let context = contexts.get("mouse" + key);
                move(event, context);
            }

            button = button << 1;
        }

        move(event, context);
    }

    let mouseup = event => {
        console.log("end", event.button);
        let context = contexts.get("mouse" + (1 << event.button));
        end(event, context);
        contexts.delete("mouse" + (1 << event.button))
        if (event.buttons === 0) {
            document.removeEventListener("mousemove", mousemove);
            document.removeEventListener("mouseup", mouseup)
            isListeningMouse = false;

        }


    }
    if (!isListeningMouse) {
        document.addEventListener("mousemove", mousemove);
        document.addEventListener("mouseup", mouseup)
        isListeningMouse = true;
    }

})

let contexts = new Map();
element.addEventListener("touchstart", event => {
    for (let touch of event.changedTouches) {
        let context = Object.create(null);
        contexts.set(touch.identifier, context)
        start(touch, context);
    }

})
element.addEventListener("touchmove", event => {
    for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        move(touch, context);
    }

})
element.addEventListener("touchend", event => {
    for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        end(touch, context);
        contexts.delete(touch.identifier);
    }

})
element.addEventListener("touchcancel", event => {
    for (let touch of event.changedTouches) {
        let context = contexts.get(touch.identifier);
        cancel(touch, context);
        contexts.delete(touch.identifier);
    }

})

let handler;
let startX, startY;
let isPan = false, isTap = true, isPress = false;


let start = (point, context) => {

    context.startX = point.clientX, context.startY = point.clientY;

    context.isTap = true;
    context.isPan = false;
    context.isPress = false;

    context.handler = setTimeout(() => {
        context.isTap = false;
        context.isPan = false;
        context.isPress = true;
        // 为了防止出问题
        context.handler = null;
        console.log("press");

    })
}
let move = (point, context) => {
    let dx = point.clientX - context.startX, dy = point.clientY - context.startY;
    let d = dx ** 2 + dy ** 2;
    if (!context.isPan && d > 100) {
        context.isPan = true;
        context.isTap = false;
        context.isPress = false;
        console.log("panstart");
        clearTimeout(context.handler);
    }
    if (context.isPan) {
        console.log(dx, dy);
        console.log("pan")
    }

}
let end = (point, context) => {
    // debugger

    if (context.isTap) {
        console.log("tap")
        clearTimeout(context.handler);
    }
    if (context.isPan) {
        console.log("panend")
    }
    if (context.isPress) {
        console.log("pressend")
    }

}
let cancel = (point, context) => {
    clearTimeout(context.handler);
    console.log("cancle", point.clientX, point.clientY)
}