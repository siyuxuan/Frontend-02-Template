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
    response.end(`<html lang="en"> <head><title>test</title>
<style>
  *{padding:0;margin:0}
  p{font-size:24px;text-algin:center;}
  </style>
</head>
<body>
  <p>Hello world!</p>
</body>   
</html>`);
  })
  
}).listen(8088);
console.log("server started");
/*
 * <meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /> 抛出Tag start end dosen't match!
 <! doctype html>
 */
  