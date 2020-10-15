import {Component, createElement} from "./framework.js" 
import {Carousel} from "./carousel.js"
import {Timeline, Animation} from "./animation.js"

let d = [
     "img/part1.jpg",
     "img/part2.jpg",
     "img/part3.jpg",
     "img/part4.jpg"
]
// 将数组d设置到attribute上去
let a = <Carousel src={d}/>

a.mountTo(document.body);

// let tl = new Timeline();
// window.tl = tl;
// window.animation = new Animation({set a(v){console.log(v)}},"a", 0, 100, 1000, null);

// tl.add(new Animation({set a(v){console.log(v)}},"a", 0, 100, 1000, null))
// tl.start();
// tl.add(animation)
