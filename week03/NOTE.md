学习笔记
1、StingToNumber(string) 如果传入的是科学计数法的数字字符串 怎么转成十进制的数字呢
2、JavaScript执行（二）：闭包和执行上下文到底是怎么回事？ 关于Realm的知识中

以下代码展示了在浏览器环境中获取来自两个 Realm 的对象，它们跟本土的 Object 做 instanceOf 时会产生差异：

var iframe = document.createElement('iframe')
document.documentElement.appendChild(iframe)
iframe.src="javascript:var b = {};"

var b1 = iframe.contentWindow.b;
var b2 = {};

console.log(typeof b1, typeof b2); //object object

console.log(b1 instanceof Object, b2 instanceof Object); //false true
我从我的电脑上运行以上代码 console.log(typeof b1, typeof b2); 输出是undefined object 和老师的不一样 能解释一下原因吗