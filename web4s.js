const http=require("http"),https=require("https"),fs=require("fs");

exports.server=class{
    constructor(){
        let _port=80;
        let email;
        let server;
        let sites={};
        let e404=(req,res,url)=>{
            res.writeHead(404,{"content-type":"text/html"});
            res.end(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>404 - Page not found</title><style>:root,body{background-color:#0f1a25}h1,h2,code,p{font-family:"Lucida Console",Monaco,monospace;color:#ffffff;text-align:center;}div{display:flex;justify-content:center;}code{background-color:#1e2f3f;padding:.5em;color:tomato;max-width:50vw;min-width:50vw;border-radius:.75em;box-shadow:0px 0px .25em .25em #00000040;}svg{width:12.5vw}a svg rect{transition:fill .25s ease}a:hover svg rect{fill:#1e2f3f80}a{color:#ffffff;font-size:1.5em;font-weight:bold;max-width:25vw}p{max-width:50vw}</style></head><body><h1>404 - Page not found</h1><h2>There is no content here.</h2><br/><div><code>404 - Page, "${url}" not found.</code></div><div><p>If you think this is a mistake, please contact the owner of this website by clicking on the mail icon below:</p></div><br/><div><a href="mailto:${email}"><svg viewBox="0 0 1024 1024"><rect x="0" y="0" rx="96" ry="96" width="1024" height="1024" fill="#0f1a25"></rect><line x1="202" y1="320" x2="822" y2="320" stroke-width="64" stroke-linecap="round" stroke="#00a5c6"></line><line x1="822" y1="320" x2="822" y2="704" stroke-width="64" stroke-linecap="round" stroke="#00799f"></line><line x1="202" y1="704" x2="822" y2="704" stroke-width="64" stroke-linecap="round" stroke="#00a5c6"></line><line x1="202" y1="320" x2="202" y2="704" stroke-width="64" stroke-linecap="round" stroke="#00799f"></line><line x1="202" y1="320" x2="222" y2="320" stroke-width="64" stroke-linecap="round" stroke="#00a5c6"></line><line x1="202" y1="320" x2="512" y2="512" stroke-width="64" stroke-linecap="round" stroke="#00a5c6"></line><line x1="822" y1="320" x2="512" y2="512" stroke-width="64" stroke-linecap="round" stroke="#00799f"></line></svg></a></div></body></html>`);
            functions.log(`${req.method.padStart(4)}:404 - ${url}`);
        };
        var handleRequest=(req,res,url)=>{
            var options=[e404,sites[url]];
            var condition=(sites[url]!=undefined)*1;
            options[condition](req,res,url);
        }
        var functions={
            init:(contactEmail=null,port=80,httpsMode=false,cert={})=>{
                email=contactEmail;
                _port=port;
                var mode=[
                    ()=>{server=http.createServer((req,res)=>{var url=req.headers.host+req.url;handleRequest(req,res,url);});},
                    ()=>{server=https.createServer(cert,(req,res)=>{var url=req.headers.host+req.url;handleRequest(req,res,url);});}
                ];
                mode[httpsMode*1]();
                process.on("uncaughtException",(e)=>{
                    console.log(e);
                    handleRequest=(req,res,url)=>{
                        res.writeHead(500,{"content-type":"text/html"});
                        res.end(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Internal server error</title><style>:root,body{background-color:#0f1a25}h1,h2,code{font-family:"Lucida Console",Monaco,monospace;color:#ffffff;text-align:center;}div{display:flex;justify-content:center;}code{background-color:#1e2f3f;padding:.5em;color:tomato;max-width:50vw;border-radius:.75em;box-shadow:0px 0px .25em .25em #00000040;}svg{width:12.5vw}a{color:#ffffff;font-size:1.5em;font-weight:bold;max-width:25vw}</style></head><body><h1>500 - Internal Server Error</h1><h2>Error message:</h2><br/><div><code>${e}</code></div><br/><a href="mailto:${email}"><div><svg viewBox="0 0 1024 1024"><rect x="0" y="0" rx="96" ry="96" width="1024" height="1024" fill="#0f1a25"></rect><line x1="202" y1="320" x2="822" y2="320" stroke-width="64" stroke-linecap="round" stroke="#00a5c6"></line><line x1="822" y1="320" x2="822" y2="704" stroke-width="64" stroke-linecap="round" stroke="#00799f"></line><line x1="202" y1="704" x2="822" y2="704" stroke-width="64" stroke-linecap="round" stroke="#00a5c6"></line><line x1="202" y1="320" x2="202" y2="704" stroke-width="64" stroke-linecap="round" stroke="#00799f"></line><line x1="202" y1="320" x2="222" y2="320" stroke-width="64" stroke-linecap="round" stroke="#00a5c6"></line><line x1="202" y1="320" x2="512" y2="512" stroke-width="64" stroke-linecap="round" stroke="#00a5c6"></line><line x1="822" y1="320" x2="512" y2="512" stroke-width="64" stroke-linecap="round" stroke="#00799f"></line></svg></div><div>Contact owner</a></div></body></html>`);
                    };
                });
            },
            log:console.log,
            domain:"localhost",
            server:"web4s",
            raw:(url,execute,domain=functions.domain)=>{
                sites[domain+url]=(req,res,url)=>{execute(req,res,url);};
            },
            get:(url,body,execute=()=>{},responseCode=200,contentType="text/html",headers={},domain=functions.domain)=>{
                sites[domain+url]=(req,res,url)=>{
                    res.writeHead(responseCode,Object.assign({"content-type":contentType,"server":functions.server},headers));
                    execute(req,res,url);
                    res.end(body);
                    functions.log(`${req.method.padStart(4)}:${responseCode} - ${url}`);
                };
            },
            getFile:(url,filename,execute=()=>{},responseCode=200,contentType="text/html",headers={},domain=functions.domain)=>{
                sites[domain+url]=(req,res,url)=>{
                    res.writeHead(responseCode,Object.assign({"content-type":contentType,"server":functions.server},headers));
                    execute(req,res,url);
                    fs.createReadStream(filename).pipe(res);
                    functions.log(`${req.method.padStart(4)}:${responseCode} - ${url}`);
                };
            },
            post:(url,body,execute=()=>{},responseCode=200,contentType="text/html",headers={},domain=functions.domain)=>{
                sites[domain+url]=(req,res,url)=>{
                    var data="";
                    req.on("data",(d)=>{data+=d});
                    res.writeHead(responseCode,Object.assign({"content-type":contentType,"server":functions.server},headers));
                    req.on("end",()=>{execute(req,res,url,data);res.end(body);});
                    functions.log(`${req.method.padStart(4)}:${responseCode} - ${url}`);
                };
            },
            postFile:(url,filename,execute=()=>{},responseCode=200,contentType="text/html",headers={},domain=functions.domain)=>{
                sites[domain+url]=(req,res,url)=>{
                    var data="";
                    req.on("data",(d)=>{data+=d});
                    res.writeHead(responseCode,Object.assign({"content-type":contentType,"server":functions.server},headers));
                    req.on("end",()=>{execute(req,res,url,data);fs.createReadStream(filename).pipe(res)});
                    functions.log(`${req.method.padStart(4)}:${responseCode} - ${url}`);
                };
            },
            handle404:(body,execute=()=>{},contentType="text/html",responseCode=200,headers={})=>{
                this.e404=(req,res,url)=>{
                    res.writeHead(responseCode,{"content-type":contentType,"server":functions.server}.merge(headers));
                    execute(req,res,url);
                    res.end(body);
                    functions.log(`${req.method.padStart(4)}:${responseCode} - ${url}`);
                }
            },
            listen:(port=_port)=>{server.listen(port,()=>{console.log(`The server is listening on port ${port}. http://localhost:${port}`)})}
        }
        return functions;
    }
};