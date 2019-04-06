
## 持续集成badges

[![Build Status](https://www.travis-ci.org/PlusLius/node-use.svg?branch=master)](https://www.travis-ci.org/PlusLius/node-use)
[![codecov](https://codecov.io/gh/PlusLius/node-use/branch/master/graph/badge.svg)](https://codecov.io/gh/PlusLius/node-use)


> https://github.com/dwyl/repo-badges 各种badges生成


### 单元测试

```js
module.exports = {
    add(...args){
        return args.reduce((total,next) => (
            total + next
        ))
    },
    mul(...args){
        return args.reduce((total,next) => (
            total * next
        ))
    }
}
```

```js
const {add,mul} = require('./number')
const assert = require('assert')

assert.equal(add(2,2),5)

/*assert.js:42
  throw new errors.AssertionError({
  ^

AssertionError [ERR_ASSERTION]: 4 == 5
*/
```

#### 使用chai断言库

```js
const {add,mul} = require('./number')
// const assert = require('assert')
//assert.equal(add(2,2),5)

const {should,expect,assert} = require('chai')

//should断言
should()
add(2,3).should.equal(5)
//expect断言
expect(add(2,3)).to.be.equal(5)
//assert断言
assert.equal(add(2,3),5)

```

#### mocha测试框架

```js
const {expect} = require('chai')

describe('#math',() => {
    describe('add',() => {
        it('should return 5 when 2 + 3', () => {
            expect(add(2,3),5)
        })
        it('should return 5 when 2 + 3', () => {
            expect(add(2,-3),-1)
        })
    })
    describe('mul',() => {
        it('should return 6 when 2 * 3',() => {
            expect(mul(2,3),6)
        })
    })
})

```

#### istanbul代码覆盖率

```js

"scripts": {
    "test": "mocha unitTest/test.js",
    "cover": "istanbul cover _mocha --reporter unitTest/test.js"
}
  
  
=============================== Coverage summary ===============================
Statements   : 100% ( 16/16 )
Branches     : 100% ( 0/0 )
Functions    : 100% ( 2/2 )
Lines        : 100% ( 16/16 )
================================================================================
```


### travis-ci

> 跑当前语言的不同版本的不同分支执行不同命令来达到效果

```yml
language: node_js
node_js:
  - "7"
brancher:
  only:
    - "dev"
    - "master"
install:
  - "npm install"
  - "npm install -g codecov"
script:
  - "istanbul cover ./node_modules/mocha/bin/_mocha --reporter lcovonly -- -R spec"
  - "codecov"
```

### benchmark基准测试

```js
const {num1,num2} = require('./benchmark')
const Benchmark = require('benchmark')

var suite = new Benchmark.Suite;

suite.add('parseInt',() => {
    num1('123456')
}).add('Number',() => {
    num2('123456')
}).on('cycle',event => console.log(String(event.target))
).on('complete',function(){
    console.log('Fastest is ' + this.filter('fastest').map('name'));
}).run({async:true})

// run async
.run({ 'async': true });
```

## UI测试

```js
module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins:[
        '@babel/plugin-proposal-class-properties'
    ]
};
```

```js
  "scripts": {
    "jest": "jest uiTest/ui.test.js --coverage"
  },
```

```js
import React from 'react'
import Enzyme,{mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon'
Enzyme.configure({adapter: new Adapter()});
import Demo from './ui'

describe('UI test Demo',() => {
    it('should have title',() => {
        const wrapper = mount(<Demo/>)
        const title = wrapper.find('h1')
        expect(title).toHaveLength(1)
        expect(title.text()).toBe('this is a demo')
    })
    it('should add 1 when click button',() => {
        const wrapper = mount(<Demo/>)
        const counter  = wrapper.find('.counter')
        const v1 = parseInt(counter.text())
        wrapper.find('button').simulate('click')
        const v2 = parseInt(counter.text())
        expect(v2).toBe(v1 + 1)
    })
    it('should change when input number',() => {
        const wrapper = mount(<Demo/>)
        const counter = wrapper.find('.counter')
        wrapper.find('input').simulate('change',{
            target:{
                value:5
            }
        })
        expect(counter.text()).toBe('5')
    })
    it('should change when props change',() => {
        const wrapper = mount(<Demo title="Demo" value={5}/>)
        sinon.spy(Demo.prototype,"componentWillReceiveProps")
        const title = wrapper.find('h1')
        wrapper.setProps({
            title:'Demo2',
        })
        expect(title.text()).toBe('Demo2')
        const callCount = Demo.prototype.componentWillReceiveProps.callCount
        expect(callCount).toBe(1)
    })
})

```

