## replace的使用

[![Build Status](https://www.travis-ci.org/PlusLius/node-use.svg?branch=master)](https://www.travis-ci.org/PlusLius/node-use)
[![codecov](https://codecov.io/gh/PlusLius/node-use/branch/master/graph/badge.svg)](https://codecov.io/gh/PlusLius/node-use)



```js
//正则匹配的情况下，首先匹配表达式然后匹配子表达式，根据返回的内容替换掉匹配到的内容
let a = '/school/:name/:age'.replace(/:([^\/]+)/g,function(){
  console.log(arguments)
  return '([^\/]+)'
})

console.log(a)

[object Arguments] {
  0: ":name", //表达式匹配的内容
  1: "name", //子表达式匹配的内容
  2: 8,
  3: "/school/:name/:age"
}
[object Arguments] {
  0: ":age",
  1: "age",
  2: 14,
  3: "/school/:name/:age"
}
"/school/([^/]+)/([^/]+)"

```

## match的使用

```js
match() 方法将检索字符串 stringObject，以找到一个或多个与 regexp 匹配的文本。这个方法的行为在很大程度上有赖于 regexp 是否具有标志 g。

如果 regexp 没有标志 g，那么 match() 方法就只能在 stringObject 中执行一次匹配。如果没有找到任何匹配的文本， match() 将返回 null。否则，它将返回一个数组，其中存放了与它找到的匹配文本有关的信息。该数组的第 0 个元素存放的是匹配文本，而其余的元素存放的是与正则表达式的子表达式匹配的文本。除了这些常规的数组元素之外，返回的数组还含有两个对象属性。index 属性声明的是匹配文本的起始字符在 stringObject 中的位置，input 属性声明的是对 stringObject 的引用。

如果 regexp 具有标志 g，则 match() 方法将执行全局检索，找到 stringObject 中的所有匹配子字符串。若没有找到任何匹配的子串，则返回 null。如果找到了一个或多个匹配子串，则返回一个数组。不过全局匹配返回的数组的内容与前者大不相同，它的数组元素中存放的是 stringObject 中所有的匹配子串，而且也没有 index 属性或 input 属性。

let params = []
let a = '/school/:name/:age'.replace(/:([^\/]+)/g,function(){
  params.push(arguments[1])
  return '([^\/]+)'
})

console.log(a) // /school/([^/]+)/([^/]+)
console.log(new RegExp(a)) // //school/([^/]+)/([^/]+)/

console.log(`/school/plus/24`.match(new RegExp(a)))

/*
0: "/school/plus/24" //匹配的文本
1: "plus" //子匹配
2: "24" // 子匹配
groups: undefined
index: 0 //匹配的起始位置
input: "/school/plus/24" //引用字符串
length: 3
*/
```

## stack

```js
let stack = [
  next => (console.log(1),next()),
  next => (console.log(2),next())
]

let i = 0
function next(){
  if(i >= stack.length)return 
  stack[i++](next)
}
next()
```

## Function

```js
var function_name = new function(arg1, arg2, ..., argN, function_body)


 let a = new Function('plus','console.log(plus)')
 console.log(a)
 a('world')
 
 /*
 function anonymous(plus) {
    window.runnerWindow.proxyConsole.log(plus)
 }
 */

let str = `
<%if(user){%>
   hello <%=user.name%>
<%}else{%>
   hello guest
<%}%>
`;

let script = `
let tpl = '';
with (obj) {
    if (user) {
        tpl += 'hello cc';
    } else {
        tpl += 'hello guest';
    }
}
return tpl;
`;

let obj = { user: { name: 'plus' } };
let fn = new Function('obj', script);

console.log(fn(obj))
```

## with

```js
expression
将给定的表达式添加到在评估语句时使用的作用域链上。表达式周围的括号是必需的。
statement
任何语句。要执行多个语句，请使用一个块语句 ({ ... })对这些语句进行分组。

with (expression) {
    statement
}

let obj = {name:'plus',age:24}

with(obj){
  console.log(name)
  console.log(age)
}

```

## template

```js
//将对象用with包裹起来方便取数据
//tpl用来收集数据

let str = `
<%if(user){%>
   hello <%=user.name%>
<%}else{%>
   hello guest
<%}%>
<ul>
<%for(let i=0;i<total;i++){%>
  <li><%=i%></li>
<%}%>
</ul>
`;


let options = { user: { name: 'plus' }, total: 5 };

function render(str, options, callback) {
   let head = 'with(obj){\n let tpl = `'
   str = str.replace(/<%=([\s\S]+?)%>/g,function(){
        return '${' + arguments[1] + '}'
   })
   str = str.replace(/<%([\s\S]+?)%>/g,function(){
        return  '`;\n ' + arguments[1] + 'tpl += `'
   })
   let tail = '`\nreturn tpl;}'
   let html = head + str + tail

   let render = new Function('obj',html)
   let result = render(options)

   return callback(result)
}
let result = render(str, options,(result) => console.log(result));


(function anonymous(obj) {
    let tpl =``; 
    with(obj){ 
        tpl += ``;
     if(user){ 
         tpl += `hello ${user.name}`;
     }else{ 
         tpl += `hello guest`;
     } 
     tpl += `<ul>`;
     {;
        window.runnerWindow.protect.protect({ line: 8, reset: true });
        for(let i=0;i<total;i++){;
            if(window.runnerWindow.protect.protect({ line: 8 })) break;
            tpl += ` <li>${i}</li>`;
        }
     } 
     tpl += `</ul>`
    }
    return tpl;
})

/*

hello plus

<ul>

  <li>0</li>

  <li>1</li>

  <li>2</li>

  <li>3</li>

  <li>4</li>

</ul>

*/

```