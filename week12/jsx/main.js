function createElement(type, attributes,...children){
     // ...children 不定参数个数
     let element;
     if(typeof type === "string")
          element= new ElementWrapper(type);
     else
          element = new type;
     for(let name in attributes){
          element.setAttribute(name,attributes[name]);
     }
     //console.log(children)
     for(let child of children){
          console.log(child)
          if(typeof child === "string"){
               child = new TextWrapper(child);
          }
          element.appendChild(child);
     }
     return element;
}
class TextWrapper{
     constructor(content){
          this.root = createTextNode(content)    
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

class ElementWrapper{
     constructor(type){
          this.root = createElement(type)    
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
class Div{
     constructor(){
          this.root = createElement("div")    
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
let a= <Div id ="a">
     <span>a</span>
     <span>b</span>
     <span>c</span>
</Div>

// let e = <div id ="test">
//      <span>a</span>
//      <span>b</span>
//      <span>c</span>
// </div>

// document.body.appendChild(e);
a.mountTo(document.body);