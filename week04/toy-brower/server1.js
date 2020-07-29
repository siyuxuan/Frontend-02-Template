const http = require('http');

// Create an HTTP server
const server = http.createServer((req, res) => {
  let body = [];
  http.request.toString('error',(err) => {
    console.log(err);
  }).on('data', (chunk) =>{
    body.push(chunk.toString());
  }).on('end', () => {
    body = body.join('');
    console.log(`body:${body}`);
    response.writeHead(200,{'Content-Type': 'text/html'});
    response.end(' Hello World\n');
  })

}).listen(8088)

console.log("server started");
  


/*  // Create an HTTP server
const server = http.createServer((req, res) => {
  console.log('request recieved');
  
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});

server.listen(8088); */