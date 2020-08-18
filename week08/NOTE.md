## 1、把一个元素的其元素逆序

 1 2 3 4 5 
 5 4 3 2 1 

 两个考点：
* 1、 你知不知道DOM的collection是一个living collection ，取出的值会跟着变化
* 2、你知不知道元素的子元素在Insert是不需要先从原来位置挪掉的 （DOM树上的子元素在进行操作的时候一定是先remove下来，然后在append到新的树上）

使用Range API 进行高效的操作

Range API 

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

创建Range后的作用
* var fragment = range.extractContents()
* range.insertNode(document.createTextNode("aaaa"))