# 轮播组件手势动画
## 动画 ：帧
* JavaScript中处理帧的函数(3种方案)

1、setInterval不可控,如果tick写的不好，会发生setInterval积压
```ruby
setInterval(() =>{
    },16)
```
2、 setTimeout
```ruby
    let tick =() =>{
        setTimeout(tick,16);
    }
```

3、比较现代的浏览器推荐使用requestAnimationFrame来做一个自重复的时间线的操作，与requestAnimationFrame相对应的有一个 cancelAnimationFrame 可以把requestAnimationFrame返回的handler的cancel掉,避免资源浪费
```ruby 
let tick = () =>{
    let handler =  requestAnimationFrame(tick);
    cancelAnimationFrame(handler);
}
```

