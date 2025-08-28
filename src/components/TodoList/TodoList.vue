<script setup lang="ts">
defineOptions({
  name: 'TodoList'
})

import { computed } from 'vue'
import type { Todo } from '@/types/todo'
import TodoItem from '@/components/TodoItem/TodoItem.vue'

// Props and emits with concise syntax
const props = withDefaults(defineProps<{
  todos: Todo[]
  loading?: boolean
}>(), {
  loading: false
})

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  update: [id: string, text: string]
}>()

// Computed properties
const hasTodos = computed(() => props.todos.length > 0)

// Methods
const handleToggle = (id: string) => {
  emit('toggle', id)
}

const handleDelete = (id: string) => {
  emit('delete', id)
}

const handleUpdate = (id: string, text: string) => {
  emit('update', id, text)
}
</script>

<template>
  <div class="todo-list">
    <div v-if="loading" class="todo-loading">
      <div class="loading-spinner"></div>
      <p>Loading todos...</p>
    </div>

    <ul v-else-if="hasTodos" class="todo-items">
      <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo" @toggle="handleToggle" @delete="handleDelete"
        @update="handleUpdate" />
    </ul>

    <div v-else class="todo-empty">
      <svg class="empty-icon" viewBox="0 0 24 24">
        <path
          d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
      <h3>No todos yet</h3>
      <p>Add your first todo to get started!</p>
    </div>
  </div>
</template>

<style scoped src="./TodoList.scss"></style>
