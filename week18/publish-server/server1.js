let http = require('http');

http.createServer(function(request, response){
    // console.log(requst);
    // request.end("Hello World");
    console.log(request.headers);
    request.on('data', chunk => {
        console.log(chunk);
    })
    request.on('end', chunk =>{
        response.end("Success!");
    })
}).listen(8082);