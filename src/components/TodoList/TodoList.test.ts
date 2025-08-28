import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoList from './TodoList.vue'
import type { Todo } from '@/types/todo'

const mockTodos: Todo[] = [
  {
    id: '1',
    text: 'First todo',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    text: 'Second todo',
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

describe('TodoList', () => {
  it('renders todos correctly', () => {
    const wrapper = mount(TodoList, {
      props: {
        todos: mockTodos
      }
    })

    expect(wrapper.find('.todo-items').exists()).toBe(true)
    expect(wrapper.findAll('li')).toHaveLength(2)
  })

  it('shows loading state when loading prop is true', () => {
    const wrapper = mount(TodoList, {
      props: {
        todos: mockTodos,
        loading: true
      }
    })

    expect(wrapper.find('.todo-loading').exists()).toBe(true)
    expect(wrapper.find('.todo-items').exists()).toBe(false)
    expect(wrapper.text()).toContain('Loading todos...')
  })

  it('shows empty state when no todos', () => {
    const wrapper = mount(TodoList, {
      props: {
        todos: []
      }
    })

    expect(wrapper.find('.todo-empty').exists()).toBe(true)
    expect(wrapper.find('.todo-items').exists()).toBe(false)
    expect(wrapper.text()).toContain('No todos yet')
    expect(wrapper.text()).toContain('Add your first todo to get started!')
  })

  it('emits toggle event when todo is toggled', async () => {
    const wrapper = mount(TodoList, {
      props: {
        todos: mockTodos
      }
    })

    await wrapper.find('.todo-toggle').trigger('click')
    
    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')?.[0]).toEqual([mockTodos[0].id])
  })

  it('emits delete event when todo is deleted', async () => {
    const wrapper = mount(TodoList, {
      props: {
        todos: mockTodos
      }
    })

    await wrapper.find('.todo-delete-btn').trigger('click')
    
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockTodos[0].id])
  })

  it('emits update event when todo is updated', async () => {
    const wrapper = mount(TodoList, {
      props: {
        todos: mockTodos
      }
    })

    // Enter edit mode
    await wrapper.find('.todo-edit-btn').trigger('click')
    
    // Update text
    const input = wrapper.find('.todo-edit-input')
    await input.setValue('Updated todo')
    await input.trigger('keydown', { key: 'Enter' })
    
    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')?.[0]).toEqual([mockTodos[0].id, 'Updated todo'])
  })
})
