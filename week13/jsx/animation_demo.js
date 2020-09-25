import {Timeline, Animation} from "./animation.js"
import {ease} from "./ease.js"

let tl = new Timeline();
tl.start();

// tl.add(new Animation({set a(v){console.log(v)}}, "a", 0, 100, 1000, null))
tl.add(new Animation(document.getElementById("ani").style, "transform", 0, 500, 2000, 0, ease, v => `translateX(${v}px)`));

tl.add(new Animation(document.getElementById("ani3").style, "transform", 0, 500, 2000, 0, null, v => `translateX(${v}px)`));
document.getElementById("ani2").style.transition = "transform 2s ease";
document.getElementById("ani2").style.transform = `translateX(500px)`;

document.getElementById("pause_btn").addEventListener("click",() => tl.pause());
document.getElementById("resume_btn").addEventListener("click",() => tl.resume());