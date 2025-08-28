import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoStats from './TodoStats.vue'

describe('TodoStats', () => {
  it('renders stats correctly', () => {
    const wrapper = mount(TodoStats, {
      props: {
        total: 5,
        active: 3,
        completed: 2,
      },
    })

    expect(wrapper.find('.todo-stats').exists()).toBe(true)
    expect(wrapper.text()).toContain('Total:5')
    expect(wrapper.text()).toContain('Active:3')
    expect(wrapper.text()).toContain('Completed:2')
  })

  it('renders zero stats correctly', () => {
    const wrapper = mount(TodoStats, {
      props: {
        total: 0,
        active: 0,
        completed: 0,
      },
    })

    expect(wrapper.text()).toContain('Total:0')
    expect(wrapper.text()).toContain('Active:0')
    expect(wrapper.text()).toContain('Completed:0')
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(TodoStats, {
      props: {
        total: 1,
        active: 1,
        completed: 0,
      },
    })

    expect(wrapper.find('.todo-stats').exists()).toBe(true)
    expect(wrapper.findAll('span')).toHaveLength(3)
  })
})
