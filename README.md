## Promise.resolve

[![Build Status](https://www.travis-ci.org/PlusLius/node-use.svg?branch=master)](https://www.travis-ci.org/PlusLius/node-use)
[![codecov](https://codecov.io/gh/PlusLius/node-use/branch/master/graph/badge.svg)](https://codecov.io/gh/PlusLius/node-use)


```js
//生成一个promise对象
Promise.resolve(1).then(data => console.log(data))
Promise.resolve(() => 123).then((data) => console.log(data))

```

## compose

```js
function compose(arr){
    function next(i){
        if(i >= arr.length){
            return null;
        }

        let middleware = arr[i]

        return middleware(i,() => next(i + 1))
    }
    return next(0)
}

let arr = [
    (i,next) => (console.log('before' + i),next(),console.log('after', + i)),
    (i,next) => (console.log('before' + i),next(),console.log('after', + i)),
    (i,next) => (console.log('before' + i),next(),console.log('after', + i)),
]
compose(arr)

```

## Promise Compose

```js
function compose(arr){
    function next(i){
        if(i >= arr.length){
            return Promise.resolve()
        }
        let middleware = arr[i]
        return Promise.resolve(middleware(i,() => next(i + 1)))
    }
    return next(0)
}

let arr = [
    async (i,next) => (console.log('before' + i),await next(),console.log('after', + i)),
    async (i,next) => (console.log('before' + i),await next(),console.log('after', + i)),
    async (i,next) => (
        console.log('before' + i),
        await new Promise((resolve,reject) => 
            setTimeout(() => {
                    console.log('loading...'),
                    resolve()
            },1000)
        ),
        console.log('after' + i)
    ),
]
compose(arr).then(data => console.log(data))
```

## 另一种写法

```js
function compose(arr){
  return (arr.reduceRight((a,b) => (
    () => b(a)
  ),() => {}))()
}

let arr2 = [
    async (next) => (console.log('before1'),await next(),console.log('after1',)),
    async (next) => (console.log('before2'),await next(),console.log('after2',)),
    async (next) => (
        console.log('before3'),
        await new Promise((resolve,reject) => 
            setTimeout(() => {
                    console.log('loading...'),
                    resolve()
            },1000)
        ),
        console.log('after3')
    ),
]

compose2(arr2)

```

### koa原理

```js
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
```

```js
const Koa = require('./koa')

const app = new Koa()
const port = 3000

app.use(async function (ctx, next) {
    console.log(1);
    await next();
    console.log(2);
});
app.use(async function (ctx, next) {
    console.log(3);
    await next();
    console.log(4);
});
app.use(async function (ctx, next) {
    console.log('5');
    ctx.res.end('ok');
});

app.listen(port)
```