// Todo Store - Pinia store for todo state management

import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import { TodoService } from '../services/todo.service'
import type { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilters } from '../types/todo'

export const useTodoStore = defineStore('todo', () => {
  // State - use shallowRef for large arrays to reduce reactivity overhead
  const todos = shallowRef<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<TodoFilters>({})

  // Memoized getters with better performance
  const filteredTodos = computed(() => {
    const { completed, search } = filters.value

    // Early return if no filters
    if (completed === undefined && !search) {
      return todos.value
    }

    return todos.value.filter((todo) => {
      // Filter by completion status
      if (completed !== undefined && todo.completed !== completed) {
        return false
      }

      // Filter by search text (case-insensitive)
      if (search && !todo.text.toLowerCase().includes(search.toLowerCase())) {
        return false
      }

      return true
    })
  })

  const stats = computed(() => {
    const total = todos.value.length
    const completed = todos.value.filter((todo) => todo.completed).length

    return {
      total,
      completed,
      active: total - completed,
    }
  })

  const hasCompletedTodos = computed(() => {
    return todos.value.some((todo) => todo.completed)
  })

  // Actions with better error handling and performance
  const loadTodos = async () => {
    if (loading.value) return // Prevent duplicate calls

    loading.value = true
    error.value = null

    try {
      todos.value = await TodoService.getAll()
    } catch (err) {
      error.value = 'Failed to load todos'
      console.error('Error loading todos:', err)
    } finally {
      loading.value = false
    }
  }

  const addTodo = async (request: CreateTodoRequest) => {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      const newTodo = await TodoService.create(request)
      todos.value = [...todos.value, newTodo] // Immutable update
    } catch (err) {
      error.value = 'Failed to add todo'
      console.error('Error adding todo:', err)
    } finally {
      loading.value = false
    }
  }

  const updateTodo = async (id: string, request: UpdateTodoRequest) => {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      const updatedTodo = await TodoService.update(id, request)
      if (updatedTodo) {
        todos.value = todos.value.map((todo) => (todo.id === id ? updatedTodo : todo))
      }
    } catch (err) {
      error.value = 'Failed to update todo'
      console.error('Error updating todo:', err)
    } finally {
      loading.value = false
    }
  }

  const deleteTodo = async (id: string) => {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      const success = await TodoService.delete(id)
      if (success) {
        todos.value = todos.value.filter((todo) => todo.id !== id)
      }
    } catch (err) {
      error.value = 'Failed to delete todo'
      console.error('Error deleting todo:', err)
    } finally {
      loading.value = false
    }
  }

  const toggleTodo = async (id: string) => {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      const updatedTodo = await TodoService.toggle(id)
      if (updatedTodo) {
        todos.value = todos.value.map((todo) => (todo.id === id ? updatedTodo : todo))
      }
    } catch (err) {
      error.value = 'Failed to toggle todo'
      console.error('Error toggling todo:', err)
    } finally {
      loading.value = false
    }
  }

  const clearCompleted = async () => {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      await TodoService.clearCompleted()
      todos.value = todos.value.filter((todo) => !todo.completed)
    } catch (err) {
      error.value = 'Failed to clear completed todos'
      console.error('Error clearing completed todos:', err)
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters: TodoFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    todos,
    loading,
    error,
    filters,

    // Getters
    filteredTodos,
    stats,
    hasCompletedTodos,

    // Actions
    loadTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    setFilters,
    clearError,
  }
})
