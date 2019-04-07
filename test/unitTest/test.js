const {add,mul} = require('./number')
// const assert = require('assert')
//assert.equal(add(2,2),5)

const {should,expect,assert} = require('chai')

// should()
// add(2,3).should.equal(5)

// expect(add(2,3)).to.be.equal(5)
// assert.equal(add(2,3),5)
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