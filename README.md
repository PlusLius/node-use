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

### 递归删除目录

```js
function rmSync(dir){
   try {
       //拿到文件对象
       let file = fs.statSync(dir)
       if(file.isFile()){
           file.unlinkSync(dir)
       }else {
           //是文件夹就要查找子文件夹,空文件夹就直接删除
           fs.readdirSync(dir).map(item => path.join(dir,item))
           .forEach(path => rmSync(path))
           //删除完文件后删目录
           fs.rmdirSync(dir)
       }
   }catch(e){
       console.log('删除失败')
   }
}
rmSync(path.join(__dirname,'a'))


function rmPromise(dir){
    //因为返回的是一个promise对象
    return new Promise((resolve,reject) => {
        //通过回调拿到文件对象
        fs.stat(dir,(err,stat) => {
            //出错了就报错
            if(err)return reject(err)
            //是目录就继续往下找
            if(stat.isDirectory()){
                //读目录
                fs.readdir(dir,(err,files) => {
                    //找路径
                    let paths = files.map(file => path.join(dir,file))
                    //递归查找路径
                    let promises = paths.map(p => rmPromise(p))
                    //所以等所有的promises都完成后执行删除目录操作
                    Promise.all(promises).then(() => fs.rmdir(dir,resolve))
                })
            } else {
                //是文件就删除
                fs.unlink(dir,resolve)
            }
        })
    })
}
rmPromise(path.join(__dirname,'a')).then(() => {
    console.log('删除成功')
})


//异步串行删除目录(深度优先)
function rmAsyncSeries(dir,callback) {
  fs.stat(dir,(err,stat) => {
      if(err)return callback(err)
      if(stat.isDirectory()){
        //读取目录
        fs.readdir(dir,(err,files) => {
            //[]收集兄弟节点
            let paths = files.map(file => path.join(dir,file))
            function next(index){
                //兄弟节点移动完毕后，文件删除完后最后目录，回溯到上层节点
                if(index >= files.length)return fs.rmdir(dir,callback)
                let current = paths[index]
                //通过next移动兄弟节点
                rmAsyncSeries(current,() => next(index + 1))
            }
            next(0)
        })
      }else {
          stat.unlink(dir,callback)
      }
  })
}

rmAsyncSeries(path.join(__dirname,'a'),err => {})

//异步并行删除目录(深度优先)
function rmAsyncParallel(dir,callback) {
   fs.stat(dir,(err,stat) => {
       if(err)return callback(err)
       if(stat.isDirectory()){
           //考察当前节点是否有子节点
          fs.readdir(dir,(err,files) => {
              let paths = files.map(file => path.join(dir,file))
              if(paths.length > 0){
                let i = 0
                function done(){
                  //当子节点考察完毕时删除当前节点
                  if(++i == paths.length){
                    fs.rmdir(dir,callback)
                  }
                }
                //有子节点考察下一节点
                paths.forEach(p => rmAsyncParallel(p,done))
              } else {
                  //空目录直接删掉
                  fs.rmdir(dir,callback)
              }
          })
       }else {
           //节点是文件直接删掉
           fs.unlink(dir,callback)
       }
   })
}

rmAsyncParallel(path.join(__dirname,'a'),err => {
 
})


//批量同步删除(广度优先)
function rmSync(dir){
    let arr = [...dir]
    let res = []
    let index = 0
    while(arr[index]){
        let current = arr[index]
        let stat = fs.statSync(current)
        //判断传入的路径是不是目录
        if(stat.isDirectory()){
            //读目录
            let dirs = fs.readdirSync(current)
            //将原来目录复制一份，将目录的值转成路径
            res.push([current,...dirs.map(d => path.join(current,d))])
            index++
        }
    }
    let list,item
    while (null != (list = res.pop())) {
       while(null != (item = list.pop())){
            //判断文件类型
            let stat = fs.statSync(item);
            if (stat.isDirectory()) {
                //删除空目录
                fs.rmdirSync(item);
            } else {
                //删除文件
                fs.unlinkSync(item);
            }
       }
    }
}
rmSync([path.join(__dirname,'a'),path.join(__dirname,'b')])


//异步删除目录(广度优先)
function rmdirWideAsync(dir,callback){
    let dirs=[dir];
    let index=0;
    function rmdir() {
        //从叶子节点开始删除兄弟节点
        let current = dirs.pop();
        if (current) {
            fs.stat(current,(err,stat) => {
                if (stat.isDirectory()) {
                    fs.rmdir(current,rmdir);
                } else {
                    fs.unlink(current,rmdir);
                }
            });
        }
    }
    !function next() {
        let current=dirs[index++];
        if (current) {
            //判断文件类型
            fs.stat(current,(err,stat) => {
                if (err) callback(err);
                if (stat.isDirectory()) {
                    //考察当前节点类型
                    fs.readdir(current,(err,files) => {
                        //转成path
                        dirs=[...dirs,...files.map(item => path.join(current,item))];
                        rmdir();
                    });
                } 
            });
        }  
    }();
}
rmdirWideAsync(path.join(__dirname,'a'),() => {

})
```

## 遍历算法

```js
//同步深度优先
function deepSync(dir){
    fs.readdirSync(dir).forEach(file=>{
        let child = path.join(dir,file);
        let stat = fs.statSync(child);
        //考察子节点状态
        if(stat.isDirectory()){
            //是文件夹继续向下考察
            deepSync(child);
        }else{
            console.log(child);
        }
    });
}
//异步深度优先
function deep(dir,callback) {
    fs.readdir(dir,(err,files)=>{
        //用next统计子节点执行情况
        !function next(index){
            if(index == files.length){
                //兄弟节点执行完毕后返回上一层
                return callback();
            }
            let child = path.join(dir,files[index]);
            fs.stat(child,(err,stat)=>{
                if(stat.isDirectory()){
                    //是文件夹继续向下考察
                    deep(child,()=>next(index+1));
                }else{
                    //向兄弟节点移动
                    console.log(child);
                    next(index+1);
                }
            })
        }(0)
    })
  }
//同步广度优先
function wideSync(dir){
    let dirs = [dir];
    while(dirs.length>0){
        let current = dirs.shift();
        console.log(current);
        let stat = fs.statSync(current);
        if(stat.isDirectory()){
            //用栈收集相邻节点
            let files = fs.readdirSync(current);
            files.forEach(item=>{
                dirs.push(path.join(current,item));
            });
        }
    }
  }
  
//异步广度优先
function wide(dir, cb) {
    fs.readdir(dir, (err, files) => {
        //用next统计子节点执行次数
        !function next(i){
            if(i>= files.length) return cb();
            let child = path.join(dir,files[i]);
            fs.stat(child,(err,stat)=>{
                if(stat.isDirectory()){
                    //继续考察下一个节点
                    wide(child, () => next(i+1));
                } else {
                    //执行相邻节点
                    console.log(child);
                    next(i+1);
                }
            })
        }(0);
    })
}
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

## API

### 读取文件,写入,拷贝,追加文件
```js
//读取
fs.readFile(path[, options], callback)
fs.readFileSync(path[, options])

options
encoding
flag flag 默认 = 'r'


//写入
fs.writeFile(file, data[, options], callback)
fs.writeFileSync(file, data[, options])

options
encoding
flag flag 默认 = 'w'
mode 读写权限，默认为0666

let fs = require('fs');
fs.writeFile('./1.txt',Date.now()+'\n',{flag:'a'},function(){
  console.log('ok');
});

//拷贝文件
function copy(src,target){
  fs.readFile(src,function(err,data){
    fs.writeFile(target,data);
  })
}

//追加文件
fs.appendFile(file, data[, options], callback)
fs.appendFile('./1.txt',Date.now()+'\n',function(){
  console.log('ok');
})

//指定位置读取

//1.打开文件
fs.open(filename,flags,[mode],callback);

FileDescriptor 是文件描述符
FileDescriptor 可以被用来表示文件
in -- 标准输入(键盘)的描述符
out -- 标准输出(屏幕)的描述符
err -- 标准错误输出(屏幕)的描述符

fs.open('./1,txt','r',0600,function(err,fd){});

//2.读取文件
fs.read(fd, buffer, offset, length, position, callback((err, bytesRead, buffer)))
const fs=require('fs');
const path=require('path');
fs.open(path.join(__dirname,'1.txt'),'r',0o666,function (err,fd) {
    console.log(err);
    let buf = Buffer.alloc(6);
     fs.read(fd,buf,0,6,3,function(err, bytesRead, buffer){
       console.log(bytesRead);//6
       console.log(buffer===buf);//true
       console.log(buf.toString());
     })
})

//3.写入文件
fs.write(fd, buffer[, offset[, length[, position]]], callback)

const fs=require('fs');
const path=require('path');
fs.open(path.join(__dirname,'1.txt'),'w',0o666,function (err,fd) {
    console.log(err);
    let buf=Buffer.from('plus');
     fs.write(fd,buf,3,6,0,function(err, bytesWritten, buffer){
       console.log(bytesWritten);//6
       console.log(buffer===buf);//true
       console.log(buf.toString());
     })
})

//4.关闭文件
fs.close(fd,[callback])
let buf = Buffer.from('plus');
fs.open('./2.txt', 'w', function (err, fd) {
  fs.write(fd, buf, 3, 6, 0, function (err, written, buffer) {
    console.log(written);
    fs.fsync(fd, function (err) {
      fs.close(fd, function (err) {
          console.log('写入完毕!')
        }
      );
    });
  })
});

//拷贝文件
let BUFFER_SIZE=1;
const path=require('path');
const fs=require('fs');
function copy(src,dest,callback) {
    let buf=Buffer.alloc(BUFFER_SIZE);
    fs.open(src,'r',(err,readFd)=>{
        fs.open(dest,'w',(err,writeFd) => {
            !function read() {
                fs.read(readFd,buf,0,BUFFER_SIZE,null,(err,bytesRead) => {
                    bytesRead&&fs.write(writeFd,buf,0,bytesRead,read);
                });
            }()
        })
    });
}
copy(path.join(__dirname,'1.txt'),path.join(__dirname,'2.txt'),()=>console.log('ok'));
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
