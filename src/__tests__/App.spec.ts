import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory, type Router } from 'vue-router'
import App from '../App.vue'

// Mock the PerformanceMonitor component
vi.mock('@/components/PerformanceMonitor.vue', () => ({
  default: {
    name: 'PerformanceMonitor',
    template: '<div class="performance-monitor">Performance Monitor</div>',
  },
}))

// Mock the TodoPage component for router
vi.mock('@/pages/TodoPage/TodoPage.vue', () => ({
  default: {
    name: 'TodoPage',
    template: '<div class="todo-page">Todo App</div>',
  },
}))

describe('App', () => {
  let router: Router

  beforeEach(() => {
    setActivePinia(createPinia())

    // Create a mock router
    router = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: '/',
          name: 'home',
          component: {
            template: '<div class="todo-page">Todo App</div>',
          },
        },
      ],
    })
  })

  it('mounts and renders properly', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    // Wait for router to resolve
    await router.isReady()

    expect(wrapper.text()).toContain('Todo App')
    expect(wrapper.text()).toContain('Performance Monitor')
  })

  it('renders RouterView and PerformanceMonitor', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.findComponent({ name: 'PerformanceMonitor' })).toBeTruthy()
  })
})
