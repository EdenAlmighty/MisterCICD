import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoHeader from './TodoHeader.vue'

describe('TodoHeader', () => {
  it('renders with default props', () => {
    const wrapper = mount(TodoHeader)

    expect(wrapper.find('.todo-header').exists()).toBe(true)
    expect(wrapper.find('.todo-title').text()).toBe('Todo App')
    expect(wrapper.find('.todo-subtitle').text()).toBe('Manage your tasks efficiently')
  })

  it('renders with custom props', () => {
    const wrapper = mount(TodoHeader, {
      props: {
        title: 'Custom Title',
        subtitle: 'Custom Subtitle',
      },
    })

    expect(wrapper.find('.todo-title').text()).toBe('Custom Title')
    expect(wrapper.find('.todo-subtitle').text()).toBe('Custom Subtitle')
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(TodoHeader)

    expect(wrapper.find('.todo-header').exists()).toBe(true)
    expect(wrapper.find('.todo-title').exists()).toBe(true)
    expect(wrapper.find('.todo-subtitle').exists()).toBe(true)
  })
})
