const fs = require('fs')
const promisify = require('util').promisify
const stat = promisify(fs.stat)
const readdir = promisify(fs.readdir)
const Handlebars = require('handlebars')
const path = require('path')
const config = require('./config')
const mime = require('./mime')

const tplPath = path.join(__dirname,"/template/dir.tpl")
const source = fs.readFileSync(tplPath)
const template = Handlebars.compile(source.toString())
const compress = require('./compress')

const range = require('./range')

module.exports = async function(req,res,filePath){
    try{
        const stats = await stat(filePath)
        if(stats.isFile()){
            const contentType = mime(filePath)
            res.setHeader('Content-Type',contentType);
            res.statusCode = 200;
            let rs;
            const {code,start,end} = range(stats.size,req,res)
    
            if(code === 200){
                rs = fs.createReadStream(filePath)
            } else {
                rs = fs.createReadStream(filePath,{
                    start,
                    end
                })
            }
            if(filePath.match(config.compress)){
                rs = compress(rs,req,res)
            }
            rs.pipe(res)
        } else if(stats.isDirectory()){
            const files = await readdir(filePath)
            res.statusCode = 200;
            res.setHeader('Content-Type','text/html');
        
            const data = {
                title:path.basename(filePath),
                dir:path.relative(config.root,filePath),
                files
            }
            res.end(template(data))

            // fs.readdir(filePath,(err,files) => {
            //     res.statusCode = 200;
            //     res.setHeader('Content-Type','text/plain');
            //     res.end(files.join(','),'utf8')
            // })
        }
    }catch(e){
        res.statusCode = 404;
        res.setHeader('Content-Type','text/plain')
        res.end(`${filePath} is not directory or file`)
    }

}