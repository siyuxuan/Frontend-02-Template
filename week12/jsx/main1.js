function createElement(type, attributes,...children){
  let element = document.createElement(type);
  for(let name in attributes){
       element.setAttribute(name, attributes[name]);
  }  
  for(let child of children){
       if(typeof child === "string"){
            child = document.createTextNode(child);
          
       }
       element.appendChild(child);
  }
  return element;
}

let e = <div id ="test">
     <span>a</span>
     <span>b</span>
     <span>c</span>
</div>

document.body.appendChild(e);
