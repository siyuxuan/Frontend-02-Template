** Q： 为什么first-letter可以设置float，first-line却不可以？
A：first letter CSS伪元素将样式应用于块级元素第一行的第一个字母，但仅当前面没有其他内容(such as images or inline tables) ,first-line CSS伪元素将样式应用于块级元素的第一行。注意，第一行的长度取决于许多因素，包括元素的宽度、文档的宽度和文本的字体大小。first-line如果float就会脱离流，就不是第一行了，产生无限循环。

** Q： 那first-line为什么可以改字体？（改了字体也不是firstline了）
A： 字是一个一个的渲染的，first-line并不是先算好那些文字在first-line里边，然后应用这些特性。而是在排版过程中，把first-line相关的属性直接加到文字上（如上图可见first-line的所有属性，除line-height外都是作用在文字上的，没有作用于盒的），直到这行满了，不是firstline了，就撤销掉这些属性。layout时操作computeCSS相关的动作。

first-letter是固定的源码里的第一个文字，而first-line是排版中的第一行，是两个不同层次的概念。