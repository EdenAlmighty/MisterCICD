import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '../App.vue'

// Mock the TodoPage component to avoid complex setup
vi.mock('../pages/TodoPage/TodoPage.vue', () => ({
  default: {
    name: 'TodoPage',
    template: '<div class="todo-page">Todo App</div>'
  }
}))

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('mounts renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Todo App')
  })
})
