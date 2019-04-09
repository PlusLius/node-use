module.exports = class Koa {
    constructor(){
        this.middlewares = []
    }
    use(fn){
        this.middlewares.push(fn)
    }
    listen(port){
        let middlewares = this.middlewares;
        require('http').createServer((req,res) => {
            let ctx = {req,res}
          
            ~(middlewares.reduceRight((a,b) => (
                () => b(ctx,a)
            ),() => {}))()
    
        }).listen(port)
    }
}