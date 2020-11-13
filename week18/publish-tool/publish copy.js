let http = require('http');
let fs = require('fs');
let archiver = require('archiver');
let child_process = require('child_process');
let querystring = require('querystring');


// 1、打开 https://github.com/login/oauth/authorize
// 28c63a8b2683ea350155524787ee35d7278714e3
// Client secret

child_process.exec(`open https://github.com/login/oauth/authorize?client_id=Iv1.ef274e10fca31348`)
//3、  创建server 接受token 点击发布
http.createServer(function(request , response){
    let query = querystring.parse(request.url.match(/^\/\?([\s\S]+)$/)[1]);
    console.log(query);

}).listen(8083)

function publish(token){
    let request = http.request({
        hostname:"127.0.0.1",
        port:8083,
        method: 'POST',
        path: "publish?token="+token,
        headers:{
            'Content-Type': 'application/octet-stream'
        }
    }, response =>{
        console.log(response);
    })

}


//  发送流式内容，并发送到服务器端
/*    let request = http.request({
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
 
*/
