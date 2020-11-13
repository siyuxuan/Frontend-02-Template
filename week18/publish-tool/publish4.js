let http = require('http');
let fs = require('fs');
let archiver = require('archiver');


// 多文件
// 获取文件大小
// fs.stat('./sample.html',(err,stats) => {
//     // 发送流式内容，并发送到服务器端
//     let request = http.request({
//         hostname:"127.0.0.1",
//         port:8082,
//         method: 'POST',
//         headers:{
//             'Content-Type': 'application/octet-stream',
//             "Content-Length":stats.size
//         }
//     }, response =>{
//         console.log(response);
//     })
// })

//  发送流式内容，并发送到服务器端
    let request = http.request({
        hostname:"127.0.0.1",
        port:8082,
        method: 'POST',
        headers:{
            'Content-Type': 'application/octet-stream'
        }
    }, response =>{
        console.log(response);
    })

    // let file = fs.createReadStream("./sample.html");
    // archiver
    const archive = archiver('zip',{
        zlib:{ level: 9}
    });
    archive.directory('./sample/', false);
    archive.finalize();
    // 加入pipe
    // archive.pipe(fs.createWriteStream('tmp.zip'));
    archive.pipe(request);
    // file.pipe(request);

    // file.on('end', () => request.end());
 

