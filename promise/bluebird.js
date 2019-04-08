module.exports = {
    promisify(fn){
        return (...args) => {
            return new Promise((resolve,reject) => {
                fn.apply(null,args.concat((err,data) =>{
                    if(err){
                        return reject(err)
                    }else {
                        resolve(data)
                    }
                }))
            })
        }
    },
    promisifyAll(obj){
        for(let attr in obj){
            if(obj.hasOwnProperty(attr) && typeof obj[attr] == 'function'){
                obj[attr + 'Async'] = this.promisify(obj[attr])
            }
        }
        return obj
    }
}