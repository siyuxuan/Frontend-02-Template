#DOM API

## 1、把一个元素的其元素逆序

 1 2 3 4 5 
 5 4 3 2 1 

 两个考点：
* 1、 你知不知道DOM的collection是一个living collection ，取出的值会跟着变化
* 2、你知不知道元素的子元素在Insert是不需要先从原来位置挪掉的 （DOM树上的子元素在进行操作的时候一定是先remove下来，然后在append到新的树上）

使用Range API 进行高效的操作

## Range API 

创建Range
* var range = new Range()
* range.setStart(element, 9) 
* range.setEnd(element, 4)
* var range = document.getSelection().getRangeAt(0);

便捷方式
* range.setStartBefore
* range.setEndBefore
* range.setStartAfter
* range.setEndAfter
* range.selectNode
* range.selectNodeContents

## 创建Range后的作用
* var fragment = range.extractContents()
* range.insertNode(document.createTextNode("aaaa"))

## CSSAPI 
* 查找a元素的css样式
```ruby
getComputedStyle(document.querySelector("a"))
```

* 查找伪类元素的样式
```ruby
getComputedStyle(document.querySelector("a"),"::before").color
```

## layout 实现div的拖拽效果
* getClientRects()
* getBoundingClientRect()

## cssom view 主要跟浏览器最后画上去的视图相关

### window
* window.innerHeight, window.innerWidth
* window.outerWidth, window.outerHeight
* window.devicePixelRatio
* window.screen
    * window.screen.width
    * window.screen.height
    * window.screen.availWidth
    * window.screen.availHeight

Window API 在新开一个窗口时会使用，现在大多数时候不会使用
```ruby
• window.open("about:blank", "_blank" 
,"width=100,height=100,left=100,right=100" )
• moveTo(x, y)
• moveBy(x, y)
• resizeTo(x, y)
• resizeBy(x, y)
```
