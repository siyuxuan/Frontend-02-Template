const http = require('http');

http.createServer((request,response) => {
  let body = [];
  request.on('error',(err) => {
    console.log(error);
  }).on('data' ,(chunk) =>{
    body.push(chunk.toString());
  }).on('end' ,() => {
    body = body.join(' ');
    console.log("body",body);
    response.writeHead(200,{'Content-Type': 'text/html'});
    response.end(" <p>Hello World</p>");
  })
  
}).listen(8088);
console.log("server started");
  