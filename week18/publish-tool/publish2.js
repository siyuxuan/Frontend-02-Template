let http = require('http');
let fs = require('fs');

// 发送流式内容，并发送到服务器端
let request = http.request({
    hostname:"127.0.0.1",
    port:8882,
    // port:8882, xuniji
    method: 'POST',
    headers:{
        'Content-Type': 'application/octet-stream'
    }
}, response =>{
    console.log(response);
})


let file = fs.createReadStream("./sample.html");

file.on('data', chunk => {
    console.log(chunk.toString());
    request.write(chunk);
})

file.on('end' , chunk => {
    console.log("read finished!");
    request.end(chunk);
})
