let Promise = require('./bluebird')

let readFile = Promise.promisify(require('fs').readFile)

readFile('./promise/1.txt','utf8').then(contents => (
    console.log(contents)
))

let fs = Promise.promisifyAll(require('fs'))

fs.readFileAsync('./promise/1.txt','utf8').then(contents => console.log(contents))