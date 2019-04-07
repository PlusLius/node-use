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