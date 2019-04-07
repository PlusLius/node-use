const buf1 = Buffer.alloc(10)
const buf4 = Buffer.alloc(10,1)
const buf2 = Buffer.allocUnsafe(10)
const buf3 = Buffer.from([1,2,3])
const buf5 = Buffer.from(`test`)
const buf6 = Buffer.from(`test`,'base64')

console.log(buf1)
console.log(buf2)
console.log(buf3)
console.log(buf4)
console.log(buf5)
console.log(buf6)

console.log(Buffer.byteLength('test'))
console.log(Buffer.byteLength('人'))

let log = console.log
log(Buffer.isBuffer({}))
log(Buffer.isBuffer(Buffer.from([1,2,3])))
log(Buffer.concat([Buffer.from('this'),Buffer.from('is')]).toString())


log(Buffer.from('人').length)
log(Buffer.alloc(10).fill(10,2,6))

const bufa = Buffer.from('test')
const bufb = Buffer.from('test')
const bufc = Buffer.from('test!')

log(bufa.equals(bufb))
log(bufa.equals(bufc))

log(bufc.indexOf('s'))

const buf = Buffer.from('中文字符串！ ')
const StringDecoder = require('string_decoder').StringDecoder
const decoder = new StringDecoder('utf8')

for(let i = 0; i < buf.length; i+=5){
    const b = Buffer.allocUnsafe(5)
    buf.copy(b,0,i);
    log(b.toString())
}

for(let i = 0; i < buf.length; i+=5){
    const b = Buffer.allocUnsafe(5)
    buf.copy(b,0,i);
    log(decoder.write(b))
}