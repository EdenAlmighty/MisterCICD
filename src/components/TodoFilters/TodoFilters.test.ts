import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoFilters from './TodoFilters.vue'

describe('TodoFilters', () => {
  it('renders filter buttons correctly', () => {
    const wrapper = mount(TodoFilters, {
      props: {
        currentFilter: 'all',
      },
    })

    expect(wrapper.find('.todo-filters').exists()).toBe(true)
    expect(wrapper.find('.filter-buttons').exists()).toBe(true)
    expect(wrapper.find('.search-input').exists()).toBe(true)
    expect(wrapper.text()).toContain('All')
    expect(wrapper.text()).toContain('Active')
    expect(wrapper.text()).toContain('Completed')
  })

  it('shows active filter correctly', () => {
    const wrapper = mount(TodoFilters, {
      props: {
        currentFilter: 'active',
      },
    })

    const activeButton = wrapper.find('button.active')
    expect(activeButton.text()).toBe('Active')
  })

  it('emits filterChange event when filter button is clicked', async () => {
    const wrapper = mount(TodoFilters, {
      props: {
        currentFilter: 'all',
      },
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('filterChange')).toBeTruthy()
    expect(wrapper.emitted('filterChange')?.[0]).toEqual(['all'])
  })

  it('emits searchChange event when search input changes', async () => {
    const wrapper = mount(TodoFilters, {
      props: {
        currentFilter: 'all',
      },
    })

    const searchInput = wrapper.find('.search-input')
    await searchInput.setValue('test search')

    expect(wrapper.emitted('searchChange')).toBeTruthy()
    expect(wrapper.emitted('searchChange')?.[0]).toEqual(['test search'])
  })

  it('displays search value correctly', () => {
    const wrapper = mount(TodoFilters, {
      props: {
        currentFilter: 'all',
        searchValue: 'test value',
      },
    })

    const searchInput = wrapper.find('.search-input')
    expect((searchInput.element as HTMLInputElement).value).toBe('test value')
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(TodoFilters, {
      props: {
        currentFilter: 'all',
      },
    })

    expect(wrapper.find('.todo-filters').exists()).toBe(true)
    expect(wrapper.find('.filter-buttons').exists()).toBe(true)
    expect(wrapper.find('.search-input').exists()).toBe(true)
  })
})
