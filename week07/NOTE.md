# 1、 css 排版
## 1. float 与 clear

## 2. margin折叠
    只会发生在正常流的BFC中

## 3. Block Container：里面有BFC的 
 * 能容纳正常流的盒，里面就有BFC，想想有哪些？ 
    • block
    • inline-block
    • table-cell
    • flex item
    • grid cell
    • table-caption
 * Block-level Box：外面有BFC的 
 * Block Box = Block Container + Block-level Box：
    里外都有BFC的

## 4. BFC合并
• block box && overflow:visible
• BFC合并与float
• BFC合并与边距折叠

## 5.0 用代码分析html标准小工具

我们采用 WHATWG 的 living standard 标准，我们先来看看标准是如何描述一个标签的，这里我们看到，有下面这些内容
```ruby

Categories:
    Flow content.
    Phrasing content.
    Embedded content.
    If the element has a controls attribute: Interactive content.
    Palpable content.
Contexts in which this element can be used:
    Where embedded content is expected.
Content model:
    If the element has a src attribute: zero or more track elements, then transparent, but with no media element descendants.
    If the element does not have a src attribute: zero or more source elements, then zero or more track elements, then transparent, but with no media element descendants.
Tag omission in text/html:
    Neither tag is omissible.
Content attributes:
    Global attributes
    src — Address of the resource
    crossorigin — How the element handles crossorigin requests
    poster — Poster frame to show prior to video playback
    preload — Hints how much buffering the media resource will likely need
    autoplay — Hint that the media resource can be started automatically when the page is loaded
    playsinline — Encourage the user agent to display video content within the element's playback area
    loop — Whether to loop the media resource
    muted — Whether to mute the media resource by default
    controls — Show user agent controls
    width — Horizontal dimension
    height — Vertical dimension
DOM interface:
    [Exposed=Window, HTMLConstructor]
    interface HTMLVideoElement : HTMLMediaElement {
      [CEReactions] attribute unsigned long width;
      [CEReactions] attribute unsigned long height;
      readonly attribute unsigned long videoWidth;
      readonly attribute unsigned long videoHeight;
      [CEReactions] attribute USVString poster;
      [CEReactions] attribute boolean playsInline;
    };
```
可以看到这里的描述分为以下6个部分：
* Categories：标签所属的分类。
* Contexts in which this element can be used：标签能够用在哪里。
* Content model：标签的内容模型。
* Tag omission in text/html：标签是否可以省略。
* Content attributes：内容属性。DOM interface：用 WebIDL 定义的元素类型接口。

我们主要关注以下Categories、Contexts in which this element can be used、Content model 这几个部分。我会带你从标准中抓取数据，做一个小工具，用来检查 X 标签是否能放入 Y 标签内：
* https://html.spec.whatwg.org/ 
在这个页面上，我们执行一下以下代码
```ruby

Array.prototype.map.call(document.querySelectorAll(".element"), e=>e.innerText);
```
这样我们得到了所有元素的定义，现在有107个，比较尴尬的是，这些文本中并不包含元素名，我们只好从 id 属性中获取，最后代码类似这样
```ruby

var elementDefinations = Array.prototype.map.call(document.querySelectorAll(".element"), e => ({
  text:e.innerText,
  name:e.childNodes[0].childNodes[0].id.match(/the\-([\s\S]+)\-element:/)?RegExp.$1:null}));
```

接下来我们用代码理解一下这些文本。首先我们来分析一下这些文本，它分成了 6 个部分，而且顺序非常固定，这样，我们可以用 JavaScript 的正则表达式匹配来拆分六个字段。我们这个小实验的目标是计算元素之间的包含关系，因此，我们先关心一下 categories 和 contentModel 两个字段
```ruby

for(let defination of elementDefinations) {

  console.log(defination.name + ":")
  let categories = defination.text.match(/Categories:\n([\s\S]+)\nContexts in which this element can be used:/)[1].split("\n");
  for(let category of categories) {
      console.log(category);
  }
    

/*
  let contentModel = defination.text.match(/Content model:\n([\s\S]+)\nTag omission in text\/html:/)[1].split("\n");
  for(let line of contentModel)
    console.log(line);
*/
}
```
