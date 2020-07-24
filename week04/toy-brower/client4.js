const net = require('net');
const { rejects } = require('assert');
const { request } = require('http');

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
        this.body =options.body || {},
        this.path = options.path || '/',
        this.headers =options.headers || {};
        if(!this.headers["Content-Type"]){
            this.headers["Content-Type"] = "application/x-www-form-urlencoded";
        }
        if(this.headers["Content-Type"] === "application/json")
            this.bodyText =JSON.stringify(this.body);
        else if((this.headers["Content-Type"] === "application/x-www-form-urlencoded"))
            // this.bodyText = Object.keys(this.body).map(key => {`${key}:${encodeURIComponent(this.body[key])`}).join('&)
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
${Object.keys(this.headers).map(key => `${key}: ${this.headers['Content-Type']}`).join('\r\n')}\r
${this.bodyText}
\r`;
    }
    send(){

    }
}

const client = net.createConnection({ 
    host:"127.0.0.1",
    port: 8088 }, 
    () => {
  // 'connect' listener.
  console.log('connected to server!');
 /* client.write(`POST / HTTP/1.1\r
  Content-Type: application/x-www-form-urlencoded\r
  Content-Length: 8\r
  \r
  name=jyy`);*/
    let request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: 8088,
        path: "/",
        body:{
            name:"jyy"
        }
    })


});
console.log(request.toString())
client.write(request.toString());
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