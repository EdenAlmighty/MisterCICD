<script setup lang="ts">
defineOptions({
  name: 'TodoItem'
})

import { ref, nextTick } from 'vue'
import type { Todo } from '@/types/todo'

// Props and emits with concise syntax
const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  update: [id: string, text: string]
}>()

// Reactive state
const isEditing = ref(false)
const editText = ref(props.todo.text)
const editInput = ref<HTMLInputElement>()

// Methods
const handleToggle = () => {
  emit('toggle', props.todo.id)
}

const handleDelete = () => {
  emit('delete', props.todo.id)
}

const handleEdit = async () => {
  isEditing.value = true
  editText.value = props.todo.text

  // Focus input after DOM update
  await nextTick()
  editInput.value?.focus()
}

const handleSave = () => {
  const trimmedText = editText.value.trim()
  if (trimmedText && trimmedText !== props.todo.text) {
    emit('update', props.todo.id, trimmedText)
  }
  isEditing.value = false
}

const handleCancel = () => {
  editText.value = props.todo.text
  isEditing.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSave()
  } else if (event.key === 'Escape') {
    handleCancel()
  }
}
</script>

<template>
  <li class="todo-item" :class="{ completed: todo.completed }">
    <div class="todo-content">
      <button class="todo-toggle" @click="handleToggle" tabindex="0"
        :aria-label="todo.completed ? 'Mark as incomplete' : 'Mark as complete'">
        <span class="todo-checkbox" :class="{ checked: todo.completed }">
          <svg v-if="todo.completed" class="check-icon" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </span>
      </button>

      <div class="todo-text-container">
        <span v-if="!isEditing" class="todo-text" @dblclick="handleEdit">
          {{ todo.text }}
        </span>
        <input v-else v-model="editText" ref="editInput" class="todo-edit-input" @keydown="handleKeydown"
          @blur="handleSave" type="text" />
      </div>
    </div>

    <div class="todo-actions">
      <button v-if="!isEditing" class="todo-edit-btn" @click="handleEdit" tabindex="0" aria-label="Edit todo">
        <svg viewBox="0 0 24 24" class="icon">
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
      </button>

      <button class="todo-delete-btn" @click="handleDelete" tabindex="0" aria-label="Delete todo">
        <svg viewBox="0 0 24 24" class="icon">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
        </svg>
      </button>
    </div>
  </li>
</template>

<style scoped src="./TodoItem.scss"></style>
