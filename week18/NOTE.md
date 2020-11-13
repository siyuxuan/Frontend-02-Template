发布系统 总结
1.拷贝本目录的信息到虚拟机上
sudo scp -r  -P 8022 ./* yanit@127.0.0.1:/home/yanit/server
拷贝express到虚拟机时  yanit@127.0.0.1:/home/yanit/server 为虚拟机用户名 和虚拟机的文件见
2、 nodejs.org stream
Readable : data close
    Event:data 
    Event:close 
     Nodejs 对于音视频、图片等binary型的文件使用Readable。

Writable:不是连续的流 
writable.write()
writable.end() 流结束

Event：'drain'


client 的 request文件只读


3. unzipper and achiver bao
readable.pipe() 把一个可读的流导入进一个可写的流里面
fs.stat获取文件大小
4、压缩 npm install --save archiver
   解压 npm install --save unzipper