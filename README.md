# node-use

## fs模块


### 递归创建目录

```js
function mkdirSync(dir){
  let res = dir.split(path.sep)
  
  function next(index){
    if(index > res.length - 1)return
    let parent = res.slice(0,index).join(path.sep)
    try{
        fs.accessSync(parent)
    }catch(e){  
        fs.mkdirSync(parent)
    }
    //++index 递归拿到的是加后的值，index++在递归中加不到
    next(++index)
  }
  next(1)
}
mkdirSync('a/b/c')


function mkdirAsync(dir){
  let res = dir.split(path.sep)
  let index = 1
  function next(){
    if(index > res.length - 1)return
    let parent = res.slice(0,index++).join(path.sep)
    try{
        fs.access(parent)
    }catch(e){  
        fs.mkdir(parent,next)
    }
  }
  next()
}
mkdirAsync('a/b/c')


async function mkdir(parent){
    return new Promise((resolve,reject) => {
        fs.mkdir(parent,err => {
            err ? reject(err) : resolve()
        })
    })
}

async function access(parent){
    return new Promise((resolve,reject) => {
        fs.access(parent,err => {
            err ? reject(err) : resolve()
        })
    })
}

async function makePromise(dir){
    let parts = dir.split(path.sep)
    for(let i = 1; i < parts.length; i++){
        let parent = parts.slice(0,i).join(path.sep)
        try{
            await access(parent)
        }catch(e){
            await mkdir(parent)
        }
    }
}
makePromise('a/b/c')


```

## path模块

```
path是node中专门处理路径的一个核心模块

path.join 将多个参数值字符串结合为一个路径字符串
path.basename 获取一个路径中的文件名
path.extname 获取一个路径中的扩展名
path.sep 操作系统提定的文件分隔符
path.delimiter 属性值为系统指定的环境变量路径分隔符
path.normalize 将非标准的路径字符串转化为标准路径字符串 特点：
可以解析 . 和 ..
多个杠可以转换成一个杠
在windows下反杠会转化成正杠
如结尾以杠结尾的，则保留斜杠
resolve
以应用程序根目录为起点
如果参数是普通字符串，则意思是当前目录的下级目录
如果参数是.. 回到上一级目录
如果是/开头表示一个绝对的根路径
```

```js
var path = require('path');
var fs = require('fs');
/**
 * normalize 将非标准化的路径转化成标准化的路径
 * 1.解析. 和 ..
 * 2.多个斜杠会转成一个斜杠
 * 3.window下的斜杠会转成正斜杠
 * 4.如果以斜杠会保留
 **/

console.log(path.normalize('./a////b//..\\c//e//..//'));
//  \a\c\

//多个参数字符串合并成一个路径 字符串
console.log(path.join(__dirname,'a','b'));

/**
 * resolve
 * 以就用程序为根目录，做为起点，根据参数解析出一个绝对路径
 *  1.以应用程序为根起点
 *  2... .
 *  3. 普通 字符串代表子目录
 *  4. /代表绝地路径根目录
 */
console.log(path.resolve());//空代表当前的目录 路径
console.log(path.resolve('a','/c'));// /a/b
// d:\c
//可以获取两个路径之间的相对关系
console.log(path.relative(__dirname,'/a'));
// a
//返回指定路径的所在目录
console.log(path.dirname(__filename)); // 9.path
console.log(path.dirname('./1.path.js'));//  9.path
//basename 获取路径中的文件名
console.log(path.basename(__filename));
console.log(path.basename(__filename,'.js'));
console.log(path.extname(__filename));

console.log(path.sep);//文件分隔符 window \ linux /
console.log(path.win32.sep);
console.log(path.posix.sep);
console.log(path.delimiter);//路径 分隔符 window ; linux :
```

## flags

```
符号	含义
r	读文件，文件不存在报错
r+	读取并写入，文件不存在报错
rs	同步读取文件并忽略缓存
w	写入文件，不存在则创建，存在则清空
wx	排它写入文件
w+	读取并写入文件，不存在则创建，存在则清空
wx+	和w+类似，排他方式打开
a	追加写入
ax	与a类似，排他方式写入
a+	读取并追加写入，不存在则创建
ax+	作用与a+类似，但是以排他方式打开文件


r 读取
w 写入
s 同步
+ 增加相反操作
x 排他方式
r+ w+的区别?
当文件不存在时，r+不会创建，而会导致调用失败，但w+会创建。
如果文件存在，r+不会自动清空文件，但w+会自动把已有文件的内容清空。
```
