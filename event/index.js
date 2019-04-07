const EventEmitter = require('events')

class CustomEvent extends EventEmitter {

}

const ce = new CustomEvent()

// ce.on('error', (err,time) => {
//     console.log(err)
//     console.log(time)
// })

// ce.emit('error',new Error('oops!'),Date.now())

function fn1(){
    console.log('fn1')
}

function fn2(){
    console.log('fn2')
}

ce.on('test',fn1)
ce.on('test',fn2)

// setInterval(() => {
//     ce.emit('test')
// },500)