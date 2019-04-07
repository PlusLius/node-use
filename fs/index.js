const fs = require('fs')

fs.readFile('xxx.js','utf8',(err,data) => {})

fs.readFileSync('xxx.js','utf8')

fs.writeFile('xxx.js','写入内容',{encoding:'utf8'},err => {})

fs.stat('xxx.js',(err,stat) => {
    stat.isFile()
    stat.isDirectory()
})

fs.rename('xxx.js','改名',(err) => {})

fs.unlink('xxx.js',(err) => {})

fs.readdir('/',(err,files) => {})

fs.mkdir('xxx',err => {})

fs.rmdir('xxx',err => {})

fs.watch('xxx',{recursive:true},(eType,filename) => {})

fs.watchFile('xxx',{recursive:true},(eType,filename) => {})