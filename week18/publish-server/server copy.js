const http = require('http');
const https = require('https');
const unzipper = require('unzipper');
const querystring = require('querystring');

//1、 auth 路由 接受code 用 code+client_it + client_secret 换token
function auth(request, response){
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getToken(query.code, function(info){
        console.log(info);
        // response.write(JSON.stringify(info));
        response.write(`<a href='http://localhost:8083?token=${info.access_token}'>publish</a>`)
        response.end();
        
    });

}
// function getToken(code){
//     let request = https.request({
//         hostname: "github.com",
//         paht: `/login/oauth/access_token?code=${code}&cilent_id=Iv1.ef274e10fca31348&client_secret=28c63a8b2683ea350155524787ee35d7278714e3`,
//         port: 443,
//         method: "POST"
//     },function(response){
//         console.log(response);
//     });
//     request.end();
// }

function getToken(code, callback) {
    let request = https.request({
      hostname: 'github.com',
      path: `/login/oauth/access_token?code=${code}&cilent_id=Iv1.ef274e10fca31348&client_secret=28c63a8b2683ea350155524787ee35d7278714e3`,
      port: 443,
      method: "POST",
    }, function(response){
        let body = "";
        response.on('data', chunk =>{   
            body += chunk.toString();
        })
        response.on('end', chunk =>{   
           callback(querystring.parse(body));
        })
    });
  
    request.end();
  
  }

  function getUser(token,callback) {
    let request = https.request({
      hostname: 'api.github.com',
      path: `/users`,
      port: 443,
      method: "GET",
      headers:{
          Authorization: `token ${token}`,
          "User-Agent": ' toy-publish-jy'
      }
    }, function(response){
        let body = "";
        response.on('data', chunk =>{   
            body += chunk.toString();
        })
        response.on('end', chunk =>{   
         callback(JSON.stringify(body))
        })
    });
  
    request.end();
  
  }
//4、用token 获取用户信息 检查权限 接受发布
function publish(request, response){
    let query = querystring.parse(request.url.match(/^\/auth\?([\s\S]+)$/)[1]);

    getUser(query.token , info =>{
        if(info.login === "siyuxuan"){
            request.pipe(outFile);
             request.pipe(unzipper.Extract({path: '../server/public'}))

        }
    });
     
    
}

http.createServer(function(request, response){
    if(request.url.match(/^\/auth\?/))
        return auth(request, response);
    
    if(request.url.match(/^\/publish\?/))
        return publish(request, response);
    // console.log('request');
    // console.log(request.headers);
    // request.pipe(unzipper.Extract({path: '../server/public'}))

}).listen(8082);