import {Component, createElement} from "./framework.js" 

class Carousel extends Component{
    constructor(){
        super();
        // 存attribute
        this.attributes = Object.create(null);
    }
    setAttribute(name, value) {
        this.attributes[name] = value;
    }
    render(){
        console.log(this.attributes.src);
        // return document.createElement("div");
        // 渲染
        this.root = document.createElement("div");
        this.root.classList.add("carousel");
        for (let record of this.attributes.src){
            // img 可以拖拽，体验不好
            // let child = document.createElement("img");
            // child.src = record;
            let child = document.createElement("div");
            child.style.backgroundImage = `url('${record}')`;
            // console.log(`url('${record}')`);
            // child.style.display = "none";

            this.root.appendChild(child);
        }
        let current = 0;
        setInterval(() =>{
            let children = this.root.children;
            ++current;
            current = current % children.length;
            for(let child of children){
                child.style.transform =`translateX(-${current * 100}%)`;
            }
        },3000)
        return this.root;
    }
    mountTo(parent){
        parent.appendChild(this.render());
    }
}

let d = [
     "img/part1.jpg",
     "img/part2.jpg",
     "img/part3.jpg",
     "img/part4.jpg"
]
// 将数组d设置到attribute上去
let a = <Carousel src={d}/>

a.mountTo(document.body);
