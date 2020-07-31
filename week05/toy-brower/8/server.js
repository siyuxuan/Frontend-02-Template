const http = require('http');

// TODO：用express搭一个server
http.createServer((request,response) => {
  let body = [];
  request.on('error',(err) => {
    console.log(error);
  }).on('data' ,(chunk) =>{
    body.push(chunk.toString());
  }).on('end' ,() => {
    body = body.join(' ');
 
    response.writeHead(200,{'Content-Type': 'text/html'});
    response.end(`<html lang="en"> <head><title>test</title>
<style>
  body #p1{color:#0f0;}
  div,p{padding:0;margin:0}
  p{width:30px;text-algin:center;font-size:24px;}

  </style>
</head>
<body>
<img src="1.jpg"/>
<p id="p1"></p>
<div>Hello world!</div>
</body>   
</html>`);
  })
  
}).listen(8088);
console.log("server started");
/*
 * <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /> 抛出Tag start end dosen't match!
 <! doctype html>
 */
  