const {
    normalize,
    join,
    resolve,
    basename,
    dirname,
    extname,
    parse,
    format,
    sep,
    delimiter,
    win32,
    posix
} = require('path')

console.log(normalize('/usr//local/bin'))
console.log(normalize('/usr//local/../bin'))

console.log(join('/usr','local','/bin/'))
console.log(join('/usr','../local','/bin/'))

console.log(resolve('./'))

const filePath = '/usr/local/bin/no.txt'

console.log(basename(filePath))
console.log(dirname(filePath))
console.log(extname(filePath))

const filePath2 = `usr/local/node_modules/n/package.json`

const ret = parse(filePath2)
console.log(ret)
console.log(format(ret))

console.log(sep)
console.log(win32.sep);

console.log(process.env.PATH);
console.log(delimiter);
console.log(win32.delimiter);

console.log(__dirname,__filename)//文件的绝对路径
console.log(process.cwd())//总是返回执行node命令所在文件夹