import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoError from './TodoError.vue'

describe('TodoError', () => {
  it('renders error message correctly', () => {
    const wrapper = mount(TodoError, {
      props: {
        message: 'Test error message',
      },
    })

    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.text()).toContain('Test error message')
  })

  it('emits clear event when close button is clicked', async () => {
    const wrapper = mount(TodoError, {
      props: {
        message: 'Test error message',
      },
    })

    await wrapper.find('.error-close-btn').trigger('click')

    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(TodoError, {
      props: {
        message: 'Test error message',
      },
    })

    expect(wrapper.find('.error-message').exists()).toBe(true)
    expect(wrapper.find('.error-close-btn').exists()).toBe(true)
  })

  it('has proper accessibility attributes', () => {
    const wrapper = mount(TodoError, {
      props: {
        message: 'Test error message',
      },
    })

    const closeButton = wrapper.find('.error-close-btn')
    expect(closeButton.attributes('aria-label')).toBe('Clear error')
  })
})
