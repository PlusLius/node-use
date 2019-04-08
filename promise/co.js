let fs = require('fs')

function readFile(filename){
    return new Promise((resolve,reject) => {
        fs.readFile(filename,'utf8',(err,data) => {
            if(err){
                reject(err)
            }else{
                resolve(data)
            }
        })
    })
}

function *read(){
    let a = yield readFile('./promise/1.txt')
    console.log(a)
    let b = yield readFile('./promise/2.txt')
    console.log(b)
}

function co(gen){
   return new Promise((resolve,reject) => {
        let g = gen()
        function next(lastValue){
            let {value,done} = g.next(lastValue)
            if(done){
                resolve(value)
            }else{
                if(value instanceof Promise){
                    value.then(next,reject)
                }else{
                    next(value)
                }
            }
        }
        next()
   })
}

co(read).then((data) => {
    console.log(data)
},(reason) => {
    console.log(reason)
})