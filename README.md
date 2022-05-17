# **Web4s Documentation**
## **What is web4s?**
### `web4s` is a branchless Node.js web framework focused on speed. It supports both HTTP and HTTPS.
---
## **web4s.server()**
### This is the main class for web4s. As it is a class, `new` must be invoked. In this documentation, `server` refers to `web4s.server()`.
---
## **server.init()**
### `server.init()` must be called in order to use any other function of the `server` class. `server.init()` has four parameters, all have preset values: **`contactEmail=null`, `port=80`, `httpsMode=false`, as well as `cert={}`**. The `contactEmail` parameter should be any email address, example: `andrew@4sberg.tech`. As you'd probably expect, `port` is just the default port. The `port` can be specified through `server.listen()`, but defaults to the value in `server.init()`. The `httpsMode` parameter should be a Boolean. If it's false the `cert` parameter will not be used. The `cert` parameter can be any value accepted by `options` in Node's built-in [https](https://nodejs.org/api/https.html#httpscreateserveroptions-requestlistener) module.
---
## **server.log**
### `server.log` is the logging method of the server. It defaults to `console.log`.
---
## **server.domain**
### `server.domain` is the default domain expected by the server. It defaults to `localhost`.
---
## **server.server**
### `server.server` is the server HTTP header, defaulting to `web4s`.
---
## **server.raw()**
### `server.raw()` is a function with three parameters: **`url`, `execute`, and `domain=server.domain`**. The `url` parameter must start with `/`, and is a URL path. `execute` is a function called that gets the `req`, `res`, and `url` parameters passed. `req` and `res` are from the HTTP/HTTPS built-in modules. `url` is the `domain` and `url` parameters combined. `domain` just defaults to `server.domain`, and is the domain the server looks for.
---
## **server.get()**
### `server.get()` has seven parameters: `url`, `body`, `execute=()=>{}`, `responseCode=200`, `contentType="text/html"`, `headers={}`, and `domain=server.domain`. As you'd expect, `body` is the actual thing displayed by the browser. `execute` is a function called after the head of the response has been written, but before it's ended.
---
## **server.getFile()**
### `server.getFile` is the same as `server.get`, except for one thing: `body` has been replaced by `filename`. It uses `fs.creatReadStream` to write a file as the body of the response.
---
## **server.post()**
### `server.post()` is the same as `server.get()`, but, `execute` is passed any form data as the parameter, `data`, which comes after `execute`'s `url` parameter.
---
## **server.postFile()**
#### `server.postFile()` is `server.post()` with a `filename` as the `body` parameter. It uses `fs.creatReadStream` to write a file as the body of the response.
---
## **server.handle404()**
### `server.handle404()` has the same parameters (excluding `domain`) as `server.get()`, and is called when the server is requested a nonexistant object.
---
## **server.listen()**
### `server.listen()` only has one parameter, `port`, which defaults to the value provided in `server.init()`. It makes the server listen for the port in the `port` parameter.
---
## **Example:**
```js
const web4s=require("web4s");
const server=new web4s.server();
server.init();
server.getFile("/","./index.html");
server.listen(80);
```