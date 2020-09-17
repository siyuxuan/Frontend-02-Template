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
        // console.log(this.attributes.src);
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
        /* let currentIndex = 0;
        // 自动播放
       setInterval(() =>{
            let children = this.root.children;
            let nextIndex = (currentIndex + 1) % children.length;

            let current = children[currentIndex];
            let next = children[nextIndex];

            // 正确位置
            next.style.transition ="none";
            next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

            setTimeout(() => {
                next.style.transition ="";
                current.style.transform = `translateX(${100 - nextIndex*100}%)`;
                next.style.transform = `translateX(${ - nextIndex * 100}%)`;
                currentIndex = nextIndex;
            }, 16);
            
        },3000)*/
        // positon
        let pos = 0;
        this.root.addEventListener("mousedown", event =>{
            let children = this.root.children;
            let startX = event.clientX;

            let move = event => {
                let x = event.clientX - startX;
                for(let child of children){
                    child.style.transition = "none";
                    child.style.transform = `translateX(-${pos * 500 + x}px)`;
                }
            }  

            let up = event=>{
                let x = event.clientX - startX;
                console.log(x);
                pos = pos - Math.round(x / 500);
                for(let child of children){
                    child.style.transition = "";
                    child.style.transform = `translateX(-${pos * 500}px)`;
                }
                document.removeEventListener("mousemove", move);
                document.removeEventListener("mouseup", up);
            }

            document.addEventListener("mousemove", move)
            document.addEventListener("mouseup", up)
            
        })
       

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
