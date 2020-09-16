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
   
   class ElementWrapper{
        constructor(type){
             this.root = document.createElement(type);
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
   
   
   class TextWrapper{
        constructor(child){
             this.root = document.createTextNode(child);
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
             this.root = document.createElement("div");
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
   
   // let a = <Div id ="test">
   //      <span>a</span>
   //      <span>b</span>
   //      <span>c</span>
   // </Div>
   
   let a = <div id ="test">
        <span>a</span>
        <span>b</span>
        <span>c</span>
   </div>
   
   // document.body.appendChild(e);
   a.mountTo(document.body);
   