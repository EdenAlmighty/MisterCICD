import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoItem from './TodoItem.vue'
import type { Todo } from '@/types/todo'

const mockTodo: Todo = {
  id: '1',
  text: 'Test todo item',
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

describe('TodoItem', () => {
  it('renders todo text correctly', () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo
      }
    })

    expect(wrapper.text()).toContain('Test todo item')
  })

  it('shows completed state when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true }
    const wrapper = mount(TodoItem, {
      props: {
        todo: completedTodo
      }
    })

    expect(wrapper.classes()).toContain('completed')
  })

  it('emits toggle event when checkbox is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo
      }
    })

    await wrapper.find('.todo-toggle').trigger('click')
    
    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('toggle')?.[0]).toEqual([mockTodo.id])
  })

  it('emits delete event when delete button is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo
      }
    })

    await wrapper.find('.todo-delete-btn').trigger('click')
    
    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete')?.[0]).toEqual([mockTodo.id])
  })

  it('enters edit mode when edit button is clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo
      }
    })

    await wrapper.find('.todo-edit-btn').trigger('click')
    
    expect(wrapper.find('.todo-edit-input').exists()).toBe(true)
    expect(wrapper.find('.todo-text').exists()).toBe(false)
  })

  it('enters edit mode when text is double-clicked', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo
      }
    })

    await wrapper.find('.todo-text').trigger('dblclick')
    
    expect(wrapper.find('.todo-edit-input').exists()).toBe(true)
  })

  it('emits update event when editing is saved', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo
      }
    })

    // Enter edit mode
    await wrapper.find('.todo-edit-btn').trigger('click')
    
    // Change text and save
    const input = wrapper.find('.todo-edit-input')
    await input.setValue('Updated todo text')
    await input.trigger('keydown', { key: 'Enter' })
    
    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('update')?.[0]).toEqual([mockTodo.id, 'Updated todo text'])
  })

  it('cancels edit mode when Escape is pressed', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo
      }
    })

    // Enter edit mode
    await wrapper.find('.todo-edit-btn').trigger('click')
    
    // Press Escape
    await wrapper.find('.todo-edit-input').trigger('keydown', { key: 'Escape' })
    
    expect(wrapper.find('.todo-edit-input').exists()).toBe(false)
    expect(wrapper.find('.todo-text').exists()).toBe(true)
  })

  it('does not emit update when text is empty', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo
      }
    })

    // Enter edit mode
    await wrapper.find('.todo-edit-btn').trigger('click')
    
    // Clear text and save
    const input = wrapper.find('.todo-edit-input')
    await input.setValue('')
    await input.trigger('keydown', { key: 'Enter' })
    
    expect(wrapper.emitted('update')).toBeFalsy()
  })

  it('does not emit update when text is unchanged', async () => {
    const wrapper = mount(TodoItem, {
      props: {
        todo: mockTodo
      }
    })

    // Enter edit mode
    await wrapper.find('.todo-edit-btn').trigger('click')
    
    // Save without changing text
    const input = wrapper.find('.todo-edit-input')
    await input.trigger('keydown', { key: 'Enter' })
    
    expect(wrapper.emitted('update')).toBeFalsy()
  })
})
