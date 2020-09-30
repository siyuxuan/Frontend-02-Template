# 组件化
## 组件化 | 手势
组件系统最重要的两个基石是动画和手势，难点在于touch事件跟mouse事件是完全不同的，所以需要将两者整合。业界手势的抽象可分为：
tap（轻点）
pan（慢拖动）
Flick/Swipe（快速拖动并离开屏幕）
press（长按离开）
常见简单的鼠标事件代码：
``` ruby
let element = document.documentElement;
element.addEventListener("mousedown", () => {
    let move = event => {
        console.log(event.clientX, event.clientY)
    }
    let end = event => {
        document.removeEventListener("mousemove", move); 
        document.removeEventListener("mouseup", end)
    }
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", end);
})
```
核心思想是在mousedown事件中监听mousemove和mouseup，否则没有点击element前也会触发mousemove和mouseup事件，而这不是我们所期望的。

另外，值得注意的是mousedown事件是要监听element，而mousemove和mouseup监听的对象则是document，原因是如果不这样的话，会出现划出element范围停止监听的情况，换成了监听document后，甚至鼠标划出浏览器都可以正常触发监听事件。

Touch事件则与mouse事件完全不同，touchmove只有在touchstart先触发后才会发生，因此不需要在touchstart中监听touchmove和touchend。Touch事件也不需要在document上监听事件，因为Touch事件天然具有目标锁定的特性，因此Touch代码如下：
``` ruby
element.addEventListener("touchstart", event => { 
    console.log('start')
})
element.addEventListener("touchmove", event => {
    console.log('move')
})
element.addEventListener("touchend", event => {
    console.log('end')
})
element.addEventListener("touchcancel", event => {
    console.log('cancel')
})
```
Touch还包含touchcancel事件，通常在系统弹窗打断或手势突然被识别为操作系统手势时触发。

## 把Mouse和Touch事件抽象到一起

![gesture_flow](https://github.com/siyuxuan/Frontend-02-Template/tree/master/week14/gesture_flow.png)
手势事件演化： 
touch事件最重要的属性touchEvent.changeTouches，是一个多触控点的类数组集合，包含单个的Touch，Touch.idetifier是触控的识别符，以便在touch事件各阶段标识每个触控点。

我们需要建立一个context来记录mouse、touch移动时的起始坐标及状态。

事件模块listener recognizer dispatcher 模块分开 
