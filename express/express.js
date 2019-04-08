const url = require('url')
const http = require('http')

module.exports = () => {
    let app = (req,res) => {
        let {pathname,query}  = url.parse(req.url,true)
        let index = 0
        req.path = pathname
        req.query = query
        res.send = (msg) => {
            let type = typeof msg
            if(type == 'object'){
                res.setHeader('Content-Type','application/json')
                msg = JSON.stringify(msg)
            } else if(type == 'number'){
                res.setHeader('Content-Type','application/plain')
                res.statusCode = msg
                res.end(http.STATUS_CODES[msg])
            } else {
                res.setHeader('Content-Type','application/html');
                res.end(msg);
            }
        }

        function next(err){
            if(index >= app.routes.length){
               return res.end(`CANNOT ${req.method} ${req.url}`)
            }
            let route = app.routes[index++]
            if(err){
                if(route.method == 'middle' && route.handle.length == 4){
                    route.handle(req,res,next)
                } else {
                    next()
                }
            }
            if(route.method == 'middle'){
                if(route.path == '/' || pathname.startsWith(route.path + '/') || route.path == pathname){
                    route.handle(req, res, next);
                } else {
                    next()
                }
            } else {
                if(route.paramNames){
                    let matcher = pathname.match(new RegExp(route.path))
                    if(matcher){
                        let params = {}
                        for(let i = 0; i < route.paramNames.length; i++){
                            params[route.paramNames[i]] = matcher[i+1]
                        }
                        req.params = params
                        route.handle(req,res)
                    }else {
                        next()
                    }
                } else {
                    if((route.path == pathname || route.path == '*') && (route.method == req.method.toLowerCase() || route.method == 'all')){
                        return route.handle(req,res)
                    } else {
                        next()
                    }
                }
            }
        }
        next()
        // for(let i = 0; i < app.routes.length; i++){
        //     let {path,method,handle} = app.routes[i]
        //     if((path == pathname || path == '*') && (method == req.method.toLowerCase() || method == 'all')){
        //         return handle(req,res)
        //     }
        //     res.end(`CANNOT ${req.method} ${req.url}`)
        // }
    }
    http.METHODS.forEach(method => {
        method = method.toLowerCase()
        app[method] = (path,handle) => {
            const layer = {path,handle,method};
            if(path.includes(':')){
                let paramNames = [];
                layer.path = path.replace(/:([^\/]+)/g,function(){
                    paramNames.push(arguments[1])
                    return '([^\/]+)'
                })
                layer.paramNames = paramNames
            }
            app.routes.push(layer)
        }
    })
    app.routes = [];
    app.listen = port => {
        require('http').createServer(app).listen(port)
    }
    app.all = (path,handle) => {
        app.routes.push({
            path,
            handle,
            method:'all'
        })
    }
    app.use = (path,handle) => {
        if(typeof handle != 'function'){
            handle = path
            path = '/'
        }
        app.routes.push({
            method:'middle',
            path,
            handle
        })
    }
    return app
}