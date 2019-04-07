## static server

[![Build Status](https://www.travis-ci.org/PlusLius/node-use.svg?branch=master)](https://www.travis-ci.org/PlusLius/node-use)
[![codecov](https://codecov.io/gh/PlusLius/node-use/branch/master/graph/badge.svg)](https://codecov.io/gh/PlusLius/node-use)


```js
const http = require('http')
const conf = require('./config')
const chalk = require('chalk')

const server = http.createServer((req,res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type','text/html')
    res.write('<h1>PLUS</h1>')
    res.end('Hello HTTP!')
})

server.listen(conf.port,conf.hostname,() => {
    const addr = `http://${conf.hostname}:${conf.port}`
    console.info(`Server started at ${chalk.green(addr)}`)
})
```

## mime

```js
const path = require('path')

const mimeTypes = {
    'css':'text/css',
    'gif':'image/gif',
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    'js':'text/javascript',
    'json':'application/json',
    'pdf':'application/pdf',
    'png':'image/png',
    'svg':'image/svg+xml',
    'swf':'application/x-shockwave-flash',
    'tiff':'image/tiff',
    'txt':'text/plain',
    'wav':'audio/x-wav',
    'wma':'audio/x-ms-wma',
    'wmv':'video/x-ms-wmv',
    'xml':'text/xml'
}

module.exports = (filePath) => {
    let ext = path.extname(filePath)
    .split('.')
    .pop()
    .toLowerCase()

    if(!ext){
        ext = filePath
    }

    return mimeTypes[ext] || mimeTypes['txt']
}
```

## range

```
 ~  CURL -r 0-20 -i http://127.0.0.1:9527/async/index.js
HTTP/1.1 200 OK
Content-Type: text/javascript
Accept-Ranges: bytes
Content-Ranges: bytes 0-20/389
Content-Length: 20
Date: Sun, 07 Apr 2019 14:36:06 GMT
Connection: keep-alive

const fs = require('%
```

```js
module.exports = (totalSize,req,res) => {
    const range = req.headers['range']

    if(!range){
        return {
            code:200
        }
    }

    const sizes = range.match(/bytes=(\d*)-(\d*)/)
    const end = sizes[2] || totalSize - 1
    const start = sizes[1] || totalSize - end

    if(start > end || start < 0 || end > totalSize){
        return {
            code:200
        }
    }

   
    res.setHeader('Accept-Ranges','bytes')
    res.setHeader('Content-Ranges',`bytes ${start}-${end}/${totalSize}`)
    res.setHeader('Content-Length',`${end - start}`)
    return {
        code:206,
        start:parseInt(start),
        end:parseInt(end)
    }
}

```

## compress

```js
const {createGzip,createDeflate} = require('zlib')

module.exports = (rs,req,res) => {
    const acceptEncoding = req.headers['accept-encoding'];
    if(!acceptEncoding || !acceptEncoding.match(/\b(gzip|deflate)\b/)){
        console.log(2)
       return rs; 
    }
    else if(acceptEncoding.match(/\bgzip\b/)){
        res.setHeader('Content-Encoding','gzip')
        return rs.pipe(createGzip())
    } else if(acceptEncoding.match(/\bdeflate\b/)){
        res.setHeader('Content-Encoding','bdeflate')
        return rs.pipe(createDeflate())
    }
}
```

## template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>{{title}}</title>
</head>
<body>
    {{#each files}}
           <div> <a href="{{../dir}}/{{this}}">{{this}}</a></div>
    {{/each}}
</body>
</html>
```