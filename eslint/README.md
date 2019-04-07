## .gitignore

[![Build Status](https://www.travis-ci.org/PlusLius/node-use.svg?branch=master)](https://www.travis-ci.org/PlusLius/node-use)
[![codecov](https://codecov.io/gh/PlusLius/node-use/branch/master/graph/badge.svg)](https://codecov.io/gh/PlusLius/node-use)


> https://git-scm.com/docs/gitignore配置

```
1.匹配模式前/代表项目根目录
2.匹配模式后加/代表是目录
3.匹配模式前加！代表取反
4.*代码任意个字符
5.?匹配一个字符
6.**匹配多级目录
node_modules/**/index.js
```

```
logs
*.log
npm-debug.log*
node_modules
*.swp
.idea/
.DS_Store
build/
```

## .npmignore

> https://docs.npmjs.com/misc/developers配置

```
默认情况下，将忽略以下路径和文件，因此无需.npmignore显式添加它们：

.*.swp
._*
.DS_Store
.git
.hg
.npmrc
.lock-wscript
.svn
.wafpickle-*
config.gypi
CVS
npm-debug.log

以下路径和文件永远不会被忽略，因此添加它们 .npmignore是没有意义的：

package.json
README （及其变种）
CHANGELOG （及其变种）
LICENSE / LICENCE
```

```
//.npmignore
src
test
```

## editorconfig

> https://editorconfig.org/配置

```

*	Matches any string of characters, except path separators (/)
**	Matches any string of characters
?	Matches any single character
[name]	Matches any single character in name
[!name]	Matches any single character not in name
{s1,s2,s3}	Matches any of the strings given (separated by commas) (Available since EditorConfig Core 0.11.0)
{num1..num2}	Matches any integer numbers between num1 and num2, where num1 and num2 can be either positive or negative
```

```
indent_style: 设置缩进风格，tab或者空格。tab是hard tabs，space为soft tabs。

indent_size: 缩进的宽度，即列数，整数。如果indent_style为tab，则此属性默认为tab_width。

tab_width: 设置tab的列数。默认是indent_size。

end_of_line： 换行符，lf、cr和crlf

charset： 编码，latin1、utf-8、utf-8-bom、utf-16be和utf-16le，不建议使用utf-8-bom。

trim_trailing_whitespace： 设为true表示会除去换行行首的任意空白字符。

insert_final_newline: 设为true表明使文件以一个空白行结尾

root: 表明是最顶层的配置文件，发现设为true时，才会停止查找.editorconfig文件。
```

```
root = true

[*]

charset = utf-8

indent_style = space
indent_size = 2

end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.json]
indent_size = 4

```

## .eslintignore

```js
//.eslintignore
build/
node_modules
test
```

## ESLint

```js
console.log(1)

console.warn

window.name

/* eslint-disable  no-console*/
console.log(2)
alert(123)
/* eslint-enable */
console.log(2)

```

```js
module.exports = {
    "extends":["eslint:recommended"],//使用推荐配置
    "parser":"babel-eslint",//指定解析器
    "rules":{//规则
        "no-console":["error",{//0.off1.warn2.error
            "allow":["warn","error","info"]
        }]
    },
    "parserOptions":{//解析器参数
        "ecmaVersion":6,//指定版本
        "sourceType":"script"//指定类型
    },
    "globals":{//全局变量
        "window":true
    },
    "env":{//环境变量
        "node":true,
        "es6":true,
        "mocha":true
    }
}

```

## npm scpripts

> 对lint不通过的代码禁止提交

```js
yarn add pre-commit
npm install --production
{
    "scripts":{
        "fix":"eslint .",
        "lint":"eslint --fix ."
    }
    "pre-comiit":[
        "fix",
        "lint"
    ],
    "devDependencies":{ //指定环境后，生产环境不会下载
        "pre-commit":"^1.2.2"
    }
}


```
