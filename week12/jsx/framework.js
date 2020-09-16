 function createElement(type, attributes,...children){
    let element;
    if(typeof type === "string"){
       // element = document.createElement(type);
       element = new ElementWrapper(type);
    }else{
         element = new type;
    }
       
    for(let name in attributes){
         element.setAttribute(name, attributes[name]);
    }  
    for(let child of children){
         if(typeof child === "string"){
            //   child = document.createTextNode(child);
            child = new TextWrapper(child); 
            
         }
         element.appendChild(child);
    }
    return element;
  }

//   提取公共部分
class Component{
    constructor(type){
        this.root = this.render();
    }
    setAttribute(name, value){
        this.root.setAttribute(name, value);
       
   }
   appendChild(child){
        child.mountTo(this.root);
   }
   mountTo(parent){
        parent.appendChild(this.root);
   } 
}
  
  class ElementWrapper extends Component{
       constructor(type){
            this.root = document.createElement(type);
       }
      
  }
  
  
  class TextWrapper  extends Component {
       constructor(child){
            this.root = document.createTextNode(child);
       }
      
  }