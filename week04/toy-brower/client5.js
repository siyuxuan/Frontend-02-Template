const net = require('net');

class Request{
    /**
     * method url=host+port+path
     * body:k/v
     * headers
     */
    constructor(options){
        this.method = options.method || "GET";
        this.host = options.host,
        this.port = options.port || 80,
        this.path = options.path || '/',
        this.body = options.body || {},
        this.headers = options.headers || {};
        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if(this.headers["Content-Type"] === "application/json")
            this.bodyText =JSON.stringify(this.body);
        else if((this.headers["Content-Type"] === "application/x-www-form-urlencoded"))
            this.bodyText =Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&');

        this.headers["Content-Length"] = this.bodyText.length;
        // console.log(this.body)

    }
    toString(){
        /**
         * `POST / HTTP/1.1\r
            Content-Type: application/x-www-form-urlencoded\r
            Content-Length: 8\r
            \r
            name=jyy`)
         */
return `${this.method} ${this.path} /HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
${this.bodyText}
\r`;
    }
//   使用send方法
    send(connection){
        new Promise((resolve,reject) =>{
            if(connection){
                connection.write(this.toString());
            }else{
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    console.log(this.toString())
                    connection.write(this.toString());
                });
            }
           
            connection.on('data', (data) => {
                console.log(`===${data.toString()}`);
                resolve(data.toString());
                // console.log(data.toString())
                connection.end();
              });
              connection.on('error', (err) => {
                reject(err) ;
                connection.end();
              });
        });
       
    }
}

// 第二步
void async function(){
    let request = new Request({
        method: "POST",
        host: "127.0.0.1",
        port: "8088",
        path: "/",
        headers: {
            ["x-foo2"]: "customed"
        },
        body:{
            name:"jyy"
        }
    })
    let response = await request.send();
    // console.log(request.send())
    console.log(response)
}();

/*
const client = net.createConnection({ 
    host:"127.0.0.1",
    port: 8088 }, 
    () => {
  // 'connect' listener.
  console.log('connected to server!');

//   client.write(`POST / HTTP/1.1\r
//   Content-Type: application/x-www-form-urlencoded\r
//   Content-Length: 8\r
//   \r
//   name=jyy`);
 let request = new Request({
     method: "POST",
     host: "127.0.0.1",
     port: "8088",
     path: "/",
     body:{
         name:"jyy"
     }
 })
 console.log(request.toString())

});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('error', (err) => {
  console.log(err) ;
  client.end();
});
client.on('end', () => {
  console.log('disconnected from server');
});

*/