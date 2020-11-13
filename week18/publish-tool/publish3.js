let http = require('http');
let fs = require('fs');

// 获取文件大小
fs.stat('./sample.html',(err,stats) => {
    // 发送流式内容，并发送到服务器端
    let request = http.request({
        hostname:"127.0.0.1",
        port:8082,
        method: 'POST',
        headers:{
            'Content-Type': 'application/octet-stream',
            "Content-Length":stats.size
        }
    }, response =>{
        console.log(response);
    })


    let file = fs.createReadStream("./sample.html");
    // 加入pipe
    file.pipe(request);

    file.on('end', () => request.end());
})



