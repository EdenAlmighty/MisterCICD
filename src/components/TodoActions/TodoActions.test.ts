import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoActions from './TodoActions.vue'

describe('TodoActions', () => {
  it('renders when there are completed todos', () => {
    const wrapper = mount(TodoActions, {
      props: {
        hasCompletedTodos: true,
      },
    })

    expect(wrapper.find('.todo-actions').exists()).toBe(true)
    expect(wrapper.find('.clear-completed-btn').exists()).toBe(true)
    expect(wrapper.text()).toContain('Clear completed')
  })

  it('does not render when there are no completed todos', () => {
    const wrapper = mount(TodoActions, {
      props: {
        hasCompletedTodos: false,
      },
    })

    expect(wrapper.find('.todo-actions').exists()).toBe(false)
  })

  it('emits clearCompleted event when button is clicked', async () => {
    const wrapper = mount(TodoActions, {
      props: {
        hasCompletedTodos: true,
      },
    })

    await wrapper.find('.clear-completed-btn').trigger('click')

    expect(wrapper.emitted('clearCompleted')).toBeTruthy()
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(TodoActions, {
      props: {
        hasCompletedTodos: true,
      },
    })

    expect(wrapper.find('.todo-actions').exists()).toBe(true)
    expect(wrapper.find('.clear-completed-btn').exists()).toBe(true)
  })
})
