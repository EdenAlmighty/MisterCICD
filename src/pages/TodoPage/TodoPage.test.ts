import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useTodoStore } from '@/stores/todo.store'
import TodoPage from './TodoPage.vue'

// Mock all the components
vi.mock('@/components/TodoHeader/TodoHeader.vue', () => ({
  default: {
    name: 'TodoHeader',
    template: '<div class="todo-header">TodoHeader</div>',
  },
}))

vi.mock('@/components/TodoError/TodoError.vue', () => ({
  default: {
    name: 'TodoError',
    template: '<div class="todo-error">TodoError</div>',
  },
}))

vi.mock('@/components/TodoForm/TodoForm.vue', () => ({
  default: {
    name: 'TodoForm',
    template: '<div class="todo-form">TodoForm</div>',
  },
}))

vi.mock('@/components/TodoStats/TodoStats.vue', () => ({
  default: {
    name: 'TodoStats',
    template: '<div class="todo-stats">TodoStats</div>',
  },
}))

vi.mock('@/components/TodoFilters/TodoFilters.vue', () => ({
  default: {
    name: 'TodoFilters',
    template: '<div class="todo-filters">TodoFilters</div>',
  },
}))

vi.mock('@/components/TodoList/TodoList.vue', () => ({
  default: {
    name: 'TodoList',
    template: '<div class="todo-list">TodoList</div>',
  },
}))

vi.mock('@/components/TodoActions/TodoActions.vue', () => ({
  default: {
    name: 'TodoActions',
    template: '<div class="todo-actions">TodoActions</div>',
  },
}))

describe('TodoPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders correctly', () => {
    const wrapper = mount(TodoPage)

    expect(wrapper.find('.todo-page').exists()).toBe(true)
    expect(wrapper.find('.todo-container').exists()).toBe(true)
    expect(wrapper.find('.todo-header').exists()).toBe(true)
  })

  it('shows error component when there is an error', async () => {
    const wrapper = mount(TodoPage)
    const todoStore = useTodoStore()

    // Set error in store
    todoStore.error = 'Test error message'
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.todo-error').exists()).toBe(true)
  })

  it('shows stats component when there are todos', async () => {
    const wrapper = mount(TodoPage)
    const todoStore = useTodoStore()

    // Set loading to false and add todos to trigger stats
    todoStore.loading = false
    todoStore.todos = [
      { id: '1', text: 'Todo 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '2', text: 'Todo 2', completed: true, createdAt: new Date(), updatedAt: new Date() },
      { id: '3', text: 'Todo 3', completed: true, createdAt: new Date(), updatedAt: new Date() },
    ]
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.todo-stats').exists()).toBe(true)
  })

  it('shows filters component when there are todos', async () => {
    const wrapper = mount(TodoPage)
    const todoStore = useTodoStore()

    // Set loading to false and add todos to show filters
    todoStore.loading = false
    todoStore.todos = [
      { id: '1', text: 'Todo 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
    ]
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.todo-filters').exists()).toBe(true)
  })

  it('shows actions component when there are completed todos', async () => {
    const wrapper = mount(TodoPage)
    const todoStore = useTodoStore()

    // Add completed todos
    todoStore.todos = [
      { id: '1', text: 'Todo 1', completed: true, createdAt: new Date(), updatedAt: new Date() },
    ]
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.todo-actions').exists()).toBe(true)
  })

  it('loads todos on mount', () => {
    const todoStore = useTodoStore()
    const loadTodosSpy = vi.spyOn(todoStore, 'loadTodos')

    mount(TodoPage)

    expect(loadTodosSpy).toHaveBeenCalled()
  })

  it('renders all required components', () => {
    const wrapper = mount(TodoPage)

    expect(wrapper.find('.todo-header').exists()).toBe(true)
    expect(wrapper.find('.todo-form').exists()).toBe(true)
    expect(wrapper.find('.todo-list').exists()).toBe(true)
  })
})
