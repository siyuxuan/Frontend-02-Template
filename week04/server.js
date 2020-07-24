const http = require('http');

const server = http.createServer((req, res) => {
    let body=[];
    req.on('error',(err) => {
        console.log('error');
    }).on('data',(chunk) => {
        body.push(trunk.toString());
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log("body",body);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('hello world\n'); 
    })
}).listen(8000);
console.log('server started');