const http = require('http')
const conf = require('./config')
const chalk = require('chalk')
const path = require('path')
const router = require('./router')


const server = http.createServer((req,res) => {
    const filePath = path.join(conf.root,req.url)
    router(req,res,filePath)
   
    // fs.stat(filePath,(err,stats) => {
    //     if(err){
    //         res.statusCode = 404;
    //         res.setHeader('Content-Type','text/plain')
    //         res.end(`${filePath} is not directory or file`)
    //         return 
    //     }

    //     if(stats.isFile()){
    //         res.setHeader('Content-Type','text/plain');
    //         res.statusCode = 200;
    //         fs.createReadStream(filePath).pipe(res)
    //     } else if(stats.isDirectory()){
    //         fs.readdir(filePath,(err,files) => {
    //             res.statusCode = 200;
    //             res.setHeader('Content-Type','text/plain');
    //             res.end(files.join(','),'utf8')
    //         })
    //     }
    // })

    // res.setHeader('Content-Type','text/html')
    // res.statusCode = 200;
    // res.write('<h1>PLUS</h1>')
    // res.end(filePath)
})

server.listen(conf.port,conf.hostname,() => {
    const addr = `http://${conf.hostname}:${conf.port}`
    console.info(`Server started at ${chalk.green(addr)}`)
})