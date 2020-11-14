let http = require('http');
let https = require('https');
let unzipper = require('unzipper');
let querystring = require('querystring');

//1、 auth 路由 接受code 用 code+client_it + client_secret 换tokena
// 28c63a8b2683ea350155524787ee35d7278714e3
function auth(request, response){
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    // console.log(query);
    getToken(query.code, function(info){
        console.log(info);
        response.write(`<a href='http://localhost:8083?token=${info.access_token}'>publish</a>`)
        response.end(); 
    });
}
function getToken(code, callback) {
    let request = https.request({
      hostname: "github.com",
      path: `/login/oauth/access_token?code=${code}&cilent_id=Iv1.ef274e10fca31348&client_secret=28c63a8b2683ea350155524787ee35d7278714e3`,
      port: 443,
      method: "POST",
    },function(response){
        console.log(response);
        let body = "";
        response.on('data', chunk => {
            body += (chunk.toString());
        })
        response.on('end', chunk => {
            callback(querystring.parse(body));
        })
    });
  
    request.end();
  
  }

//4、用token 获取用户信息 检查权限 接受发布
function publish(request, response){
    let query = querystring.parse(request.url.match(/^\/publish\?([\s\S]+)$/)[1]);
    getUser(query.token , info =>{
        // if(info.login === "siyuxuan"){
        //      request.pipe(unzipper.Extract({path: '../server/public/'}))
        //      request.on('end', function() {
        //         response.end('success!');
        //     })
        // }
        request.pipe(unzipper.Extract({path: '../server/public/'}))
        request.on('end', function() {
           response.end('success!');})
    });
}

function getUser(token,callback) {
    let request = https.request({
      hostname: 'api.github.com',
      path: `/user`,
      port: 443,
      method: "GET",
      headers:{
          Authorization: `token ${token}`,
          "User-Agent": 'toy-publish-jy'
      }
    }, function(response){
        let body = '';

        response.on('data', chunk => {
            body += (chunk.toString());
        })
        response.on('end', chunk => {
            callback(JSON.parse(body));
        })
    });
  
    request.end();
  
  }

http.createServer(function(request, response){
    console.log(request.url);
    if (request.url.match(/^\/auth\?/)) {
        return auth(request, response);
    }
    if (request.url.match(/^\/publish\?/)) {
        return publish(request, response);
    }

}).listen(8082);