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

function compose2(arr){
  return (arr.reduceRight((a,b) => (
    () => b(a)
  ),() => {}))()
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
// compose(arr).then(data => console.log(data))

compose2(arr2)
