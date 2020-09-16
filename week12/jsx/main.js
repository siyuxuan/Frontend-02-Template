import {Component, createElement} from "./framework.js" 

class Carousel extends Component{
    constructor(){
        this.root = document.createElement("div");
    }
}

let d = [
     "part1.jpg",
     "part2.jpg",
     "part3.jpg",
     "part4.jpg"
]
let a = <Carousel/>

a.mountTo(document.body);
