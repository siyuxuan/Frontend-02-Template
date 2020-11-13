let http = require('http');
let unzipper  = require('unzipper');

http.createServer(function(request, response){
    console.log('request');
    console.log(request.headers);

    // let outFile = fs.createWriteStream('../server/public/tmp.zip');
    // request.pipe(outFile);

    request.pipe(unzipper.Extract({path: '../server/public'}))

}).listen(8082);