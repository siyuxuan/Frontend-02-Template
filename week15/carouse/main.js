import {Component, createElement} from "./framework.js" 
import {Carousel} from "./Carousel.js"
import {Timeline, Animation} from "./animation.js"
import {Button} from "./Button.js"
import {List} from "./List.js"

let d = [
     {
          img: "img/part1.jpg",
          url:"https://github.com/siyuxuan/Frontend-02-Template/tree/master/week15",
          title:"狗狗"


     },{
          img: "img/part2.jpg",
          url:"https://github.com/siyuxuan/Frontend-02-Template/tree/master/week15",
          title:"狗狗"

     },{
          img:"img/part3.jpg",
          url:"https://github.com/siyuxuan/Frontend-02-Template/tree/master/week15",
          title:"狗狗"

     },{
          img:"img/part4.jpg",
          url:"https://github.com/siyuxuan/Frontend-02-Template/tree/master/week15",
          title:"狗狗"

     }
    
     
] 
// 将数组d设置到attribute上去
// let a = <Carousel src={d} 
//      onChange = {event => console.log(event.detail.position)}
//      onClick = {event => window.location.href = event.detail.data.url }/>

// let a = <Button>
//      content 
// </Button>
let a = <List data = {d}>
{(record) => 
     <div>
          <img src={record.img} />        
           <a href={record.url}>{record.title}</a>
     </div>
}
</List>
a.mountTo(document.body);



