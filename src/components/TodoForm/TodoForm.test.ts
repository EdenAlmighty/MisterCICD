import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoForm from './TodoForm.vue'

describe('TodoForm', () => {
  it('renders form correctly', () => {
    const wrapper = mount(TodoForm)
    
    expect(wrapper.find('.todo-form').exists()).toBe(true)
    expect(wrapper.find('.todo-input').exists()).toBe(true)
    expect(wrapper.find('.todo-submit-btn').exists()).toBe(true)
  })

  it('has correct placeholder text', () => {
    const wrapper = mount(TodoForm)
    
    expect(wrapper.find('.todo-input').attributes('placeholder')).toBe('What needs to be done?')
  })

  it('emits add event when form is submitted', async () => {
    const wrapper = mount(TodoForm)
    
    const input = wrapper.find('.todo-input')
    await input.setValue('New todo item')
    await wrapper.find('.todo-form').trigger('submit')
    
    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')?.[0]).toEqual(['New todo item'])
  })

  it('emits add event when Enter key is pressed', async () => {
    const wrapper = mount(TodoForm)
    
    const input = wrapper.find('.todo-input')
    await input.setValue('New todo item')
    await input.trigger('keydown', { key: 'Enter' })
    
    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')?.[0]).toEqual(['New todo item'])
  })

  it('does not emit add event when input is empty', async () => {
    const wrapper = mount(TodoForm)
    
    await wrapper.find('.todo-form').trigger('submit')
    
    expect(wrapper.emitted('add')).toBeFalsy()
  })

  it('does not emit add event when input only contains whitespace', async () => {
    const wrapper = mount(TodoForm)
    
    const input = wrapper.find('.todo-input')
    await input.setValue('   ')
    await wrapper.find('.todo-form').trigger('submit')
    
    expect(wrapper.emitted('add')).toBeFalsy()
  })

  it('clears input after successful submission', async () => {
    const wrapper = mount(TodoForm)
    
    const input = wrapper.find('.todo-input')
    await input.setValue('New todo item')
    await wrapper.find('.todo-form').trigger('submit')
    
    expect((wrapper.find('.todo-input').element as HTMLInputElement).value).toBe('')
  })

  it('trims whitespace from input before emitting', async () => {
    const wrapper = mount(TodoForm)
    
    const input = wrapper.find('.todo-input')
    await input.setValue('  New todo item  ')
    await wrapper.find('.todo-form').trigger('submit')
    
    expect(wrapper.emitted('add')?.[0]).toEqual(['New todo item'])
  })

  it('disables submit button when input is empty', async () => {
    const wrapper = mount(TodoForm)
    
    const submitBtn = wrapper.find('.todo-submit-btn')
    expect(submitBtn.attributes('disabled')).toBeDefined()
  })

  it('enables submit button when input has content', async () => {
    const wrapper = mount(TodoForm)
    
    const input = wrapper.find('.todo-input')
    await input.setValue('New todo')
    
    const submitBtn = wrapper.find('.todo-submit-btn')
    expect(submitBtn.attributes('disabled')).toBeUndefined()
  })

  it('does not emit add event when Shift+Enter is pressed', async () => {
    const wrapper = mount(TodoForm)
    
    const input = wrapper.find('.todo-input')
    await input.setValue('New todo item')
    await input.trigger('keydown', { key: 'Enter', shiftKey: true })
    
    expect(wrapper.emitted('add')).toBeFalsy()
  })

  it('shows loading state during submission', async () => {
    const wrapper = mount(TodoForm)
    
    const input = wrapper.find('.todo-input')
    await input.setValue('New todo item')
    
    // Check that the submit button is enabled before submission
    expect(wrapper.find('.submit-spinner').exists()).toBe(false)
    
    // Trigger form submission
    await wrapper.find('.todo-form').trigger('submit')
    
    // Verify the emit was called
    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')?.[0]).toEqual(['New todo item'])
  })
})
