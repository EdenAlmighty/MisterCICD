// Todo Service - CRUD operations for todos with localStorage and caching

import { asyncStorage } from './asyncStorage.service'
import { UtilService } from './util.service'
import type { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilters } from '../types/todo'

const STORAGE_KEY = 'todos'

// Simple in-memory cache for better performance
let todosCache: Todo[] | null = null
let lastCacheTime = 0
const CACHE_TTL = 5000 // 5 seconds cache TTL

export class TodoService {
  /**
   * Get all todos with caching
   */
  static async getAll(): Promise<Todo[]> {
    const now = Date.now()

    // Return cached data if still valid
    if (todosCache && now - lastCacheTime < CACHE_TTL) {
      return todosCache
    }

    // Fetch from storage and update cache
    const todos = (await asyncStorage.get<Todo[]>(STORAGE_KEY)) || []
    todosCache = todos
    lastCacheTime = now

    return todos
  }

  /**
   * Get todos with filters (uses cached data if available)
   */
  static async getFiltered(filters: TodoFilters): Promise<Todo[]> {
    const todos = await this.getAll()

    // Early return if no filters
    if (!filters.completed && !filters.search) {
      return todos
    }

    return todos.filter((todo) => {
      // Filter by completion status
      if (filters.completed !== undefined && todo.completed !== filters.completed) {
        return false
      }

      // Filter by search text (case-insensitive)
      if (filters.search && !todo.text.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      return true
    })
  }

  /**
   * Get todo by ID (uses cached data if available)
   */
  static async getById(id: string): Promise<Todo | null> {
    const todos = await this.getAll()
    return todos.find((todo) => todo.id === id) || null
  }

  /**
   * Create new todo
   */
  static async create(request: CreateTodoRequest): Promise<Todo> {
    const todos = await this.getAll()

    const newTodo: Todo = {
      id: UtilService.generateId(),
      text: request.text.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const updatedTodos = [...todos, newTodo]
    await asyncStorage.set(STORAGE_KEY, updatedTodos)

    // Update cache
    todosCache = updatedTodos
    lastCacheTime = Date.now()

    return newTodo
  }

  /**
   * Update todo
   */
  static async update(id: string, request: UpdateTodoRequest): Promise<Todo | null> {
    const todos = await this.getAll()
    const todoIndex = todos.findIndex((todo) => todo.id === id)

    if (todoIndex === -1) {
      return null
    }

    const updatedTodo: Todo = {
      ...todos[todoIndex],
      ...request,
      updatedAt: new Date(),
    }

    const updatedTodos = [...todos]
    updatedTodos[todoIndex] = updatedTodo
    await asyncStorage.set(STORAGE_KEY, updatedTodos)

    // Update cache
    todosCache = updatedTodos
    lastCacheTime = Date.now()

    return updatedTodo
  }

  /**
   * Delete todo
   */
  static async delete(id: string): Promise<boolean> {
    const todos = await this.getAll()
    const filteredTodos = todos.filter((todo) => todo.id !== id)

    if (filteredTodos.length === todos.length) {
      return false // Todo not found
    }

    await asyncStorage.set(STORAGE_KEY, filteredTodos)

    // Update cache
    todosCache = filteredTodos
    lastCacheTime = Date.now()

    return true
  }

  /**
   * Toggle todo completion status
   */
  static async toggle(id: string): Promise<Todo | null> {
    const todo = await this.getById(id)
    if (!todo) return null

    return this.update(id, { completed: !todo.completed })
  }

  /**
   * Clear all completed todos
   */
  static async clearCompleted(): Promise<void> {
    const todos = await this.getAll()
    const activeTodos = todos.filter((todo) => !todo.completed)
    await asyncStorage.set(STORAGE_KEY, activeTodos)

    // Update cache
    todosCache = activeTodos
    lastCacheTime = Date.now()
  }

  /**
   * Get todo statistics (uses cached data if available)
   */
  static async getStats(): Promise<{ total: number; completed: number; active: number }> {
    const todos = await this.getAll()
    const completed = todos.filter((todo) => todo.completed).length

    return {
      total: todos.length,
      completed,
      active: todos.length - completed,
    }
  }

  /**
   * Clear cache (useful for testing or when cache becomes stale)
   */
  static clearCache(): void {
    todosCache = null
    lastCacheTime = 0
  }

  /**
   * Invalidate cache (useful when external changes occur)
   */
  static invalidateCache(): void {
    lastCacheTime = 0
  }
}
