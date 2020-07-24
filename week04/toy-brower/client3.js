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
return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}\r
\r
${this.bodyText}
\r`;
    }
//   使用send方法
    send(connection){
        new Promise((resolve,reject) =>{
            const parser = new ResponseParser;
            if(connection){
                connection.write(this.toString());
            }else{
                connection = net.createConnection({
                    host: this.host,
                    port: this.port
                }, () => {
                    // console.log(this.toString())
                    connection.write(this.toString());
                });
            }
           
            connection.on('data', (data) => {
                parser.receive(data.toString());
                console.log(parser.statusLine); //HTTP/1.1 200 OK
                console.log(parser.headers);
                
                // resolve(data.toString());
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

class Response{

}
/**
 * ResponseParser 产生Response
 * 利用状态机处理response
 * 
 */
class ResponseParser{
    constructor(){
        this.WATTING_STATUS_LINE = 0;
        this.WATTING_STATUS_LINE_END = 1;
        this.WATTING_HEADER_NAME = 2;
        this.WATTING_HEADER_SPACE = 3;
        this.WATTING_HEADER_VALUE = 4;
        this.WATTING_HEADER_LINE_END = 5;
        this.WATTING_HEADER_BLOCK_END = 6;  
        this.WATTING_BODY=7;

        this.current = this.WATTING_STATUS_LINE;
        this.statusLine = "";
        this.headers = {}
        this.headName = "";
        this.headValue = "";
        this.bodyParser = null ;
     }
    receive(string){
        for (let i=0; i<string.length;i++){
            this.receiveChar(string.charAt(i));
        }
    }
    receiveChar(char){
        if(this.current ===  this.WATTING_STATUS_LINE){
            if(char === '\r')
                this.current = this.WATTING_STATUS_LINE_END;
            else
                this.statusLine += char;
        }else if(this.current ===  this.WATTING_STATUS_LINE_END){
            // console.log(string.charAt(i))
            // this.statusLine.push(char);/
            if(char === '\n'){
                this.current = this.WATTING_HEADER_NAME;
           }
        }else if(this.current === this.WATTING_HEADER_NAME){
            // console.log(char);
            if(char === ':'){ 
                this.current = this.WATTING_HEADER_SPACE;
                // console.log("///////");
            }else if(char === '\r'){
                this.current = this.WATTING_HEADER_BLOCK_END;
                // console.log("///////");
                if(this.headers['Transfer-Encoding'] === 'chunked'){
                   
                    this.bodyParser = new TrunkedBodyParser();
                }
            }else{
                this.headName += char;
            }
        }else if(this.current === this.WATTING_HEADER_SPACE){
            if(char === ' '){
                this.current = this.WATTING_HEADER_VALUE;
            }else{
                this.statusLine += char;
            }
        }else if(this.current === this.WATTING_HEADER_VALUE){
            if(char === '\r'){
                this.current = this.WATTING_HEADER_LINE_END;
                this.headers[this.headName] = this.headValue;
                this.headName = ''
                this.headValue = ''
            }else{
                this.headValue += char;
            }
        }else if(this.current === this.WATTING_HEADER_LINE_END){
            if(char === '\n'){
                this.current = this.WATTING_HEADER_NAME;
            }
        } else if(this.current === this.WATTING_HEADER_BLOCK_END){
            if(char === '\n'){
                this.current = this.WATTING_BODY;
            }
        }else if(this.current === this.WATTING_BODY){
            // console.log(this.bodyParser)
            // this.bodyParser.receiveChar(char);
            if(this.current === )
          
        } 
       
       

    }
}

class TrunkedBodyParser{
    constructor(){
        this.WATTING_LENGTH = 0;
        this.WATTING_LENGTH_LINE_END = 1;
        this.REANING_TRUNK = 2;
        
        this.length = 0;
        this.content =[];

        this.current = this.WATTING_LENGTH;
    }
    receiveChar(char){
        // console.log(JSON.stringify(char))
        if(this.current === this.WATTING_LENGTH){
            if(char === '\r'){
                this.current = this.WATTING_LENGTH_LINE_END
            }else{
                this.length *=10;
                this.length += 
            }
        }
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
    // console.log(response)
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