<script setup lang="ts">
defineOptions({
  name: 'TodoPage'
})

import { onMounted, computed } from 'vue'
import { useTodoStore } from '@/stores/todo.store'
import TodoHeader from '@/components/TodoHeader/TodoHeader.vue'
import TodoError from '@/components/TodoError/TodoError.vue'
import TodoForm from '@/components/TodoForm/TodoForm.vue'
import TodoStats from '@/components/TodoStats/TodoStats.vue'
import TodoFilters from '@/components/TodoFilters/TodoFilters.vue'
import TodoList from '@/components/TodoList/TodoList.vue'
import TodoActions from '@/components/TodoActions/TodoActions.vue'
import { storeToRefs } from 'pinia'

// Store
const todoStore = useTodoStore()
const { loading, error, filteredTodos, stats, hasCompletedTodos } = storeToRefs(todoStore)

// Computed properties
const currentFilter = computed(() => {
  if (todoStore.filters.completed === undefined) return 'all'
  if (todoStore.filters.completed === false) return 'active'
  return 'completed'
})

// Lifecycle
onMounted(() => {
  todoStore.loadTodos()
})

// Methods
const handleAddTodo = async (text: string) => {
  try {
    await todoStore.addTodo({ text })
  } catch (error) {
    console.error('Error adding todo:', error)
  }
}

const handleToggleTodo = async (id: string) => {
  try {
    await todoStore.toggleTodo(id)
  } catch (error) {
    console.error('Error toggling todo:', error)
  }
}

const handleDeleteTodo = async (id: string) => {
  try {
    await todoStore.deleteTodo(id)
  } catch (error) {
    console.error('Error deleting todo:', error)
  }
}

const handleUpdateTodo = async (id: string, text: string) => {
  try {
    await todoStore.updateTodo(id, { text })
  } catch (error) {
    console.error('Error updating todo:', error)
  }
}

const handleClearCompleted = async () => {
  try {
    await todoStore.clearCompleted()
  } catch (error) {
    console.error('Error clearing completed todos:', error)
  }
}

const handleFilterChange = (filter: 'all' | 'active' | 'completed') => {
  const filters: Record<string, boolean | undefined> = {
    all: undefined,
    active: false,
    completed: true
  }

  todoStore.setFilters({ completed: filters[filter] })
}

const handleSearchChange = (search: string) => {
  todoStore.setFilters({ search: search.trim() || undefined })
}

const handleClearError = () => {
  todoStore.clearError()
}
</script>

<template>
  <div class="todo-page">
    <div class="todo-container">
      <TodoHeader />

      <TodoError v-if="error" :message="error" @clear="handleClearError" />

      <TodoForm @add="handleAddTodo" />

      <TodoStats v-if="!loading" :total="stats.total" :active="stats.active" :completed="stats.completed" />

      <TodoFilters v-if="!loading && stats.total > 0" :current-filter="currentFilter"
        :search-value="todoStore.filters.search" @filter-change="handleFilterChange"
        @search-change="handleSearchChange" />

      <TodoList :todos="filteredTodos" :loading="loading" @toggle="handleToggleTodo" @delete="handleDeleteTodo"
        @update="handleUpdateTodo" />

      <TodoActions :has-completed-todos="hasCompletedTodos" @clear-completed="handleClearCompleted" />
    </div>
  </div>
</template>

<style scoped src="./TodoPage.scss"></style>
