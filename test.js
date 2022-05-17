const web4s=require("./web4s"),fs=require("fs");
const server=new web4s.server();
server.init("none",port=5555);
server.domain="localhost:5555";
server.getFile("/","./index.html");
server.listen();