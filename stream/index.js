const fs = require('fs')

const rs = fs.createReadStream('路径/xxx.js')

//输出到控制台
rs.pipe(process.stdout)

const ws = fs.createWriteStream('路径/xxx.js')

const tid = setInterval(() => {
    const num = parseInt(Math.random()*10)
    if(num < 7){
        ws.write(num + '')
    }else{
        clearInterval(tid)
        ws.end()
    }
},3000)

//监听写完事件
ws.on('finish',() => {
    console.log('done!')
})