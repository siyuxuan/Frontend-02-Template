import {Component, STATE,ATTRIBUTE , createElement} from "./framework.js"
import {enableGesture} from "./gesture.js"

export {STATE, ATTRIBUTE} from "./framework.js"
// console.log(STATE) 

export class List extends Component{
    constructor(){
        super();
        // 存attribute
      
    }
    render(){ 
        this.children = this[ATTRIBUTE].data.map(this.template) ;
        this.root = (<div>{this.children} </div>).render();
        return this.root;
    }
    appendChild(child){
        this.template = (child);
        this.render()
    }
} 