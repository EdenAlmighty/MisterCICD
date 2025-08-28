<script setup lang="ts">
defineOptions({
  name: 'TodoForm'
})

import { ref, computed } from 'vue'

// Props and emits with concise syntax
const emit = defineEmits<{
  add: [text: string]
}>()

// Reactive state
const newTodoText = ref('')
const isSubmitting = ref(false)
const inputRef = ref<HTMLInputElement>()

// Computed properties
const canSubmit = computed(() => {
  return newTodoText.value.trim() && !isSubmitting.value
})

// Methods
const handleSubmit = async () => {
  const trimmedText = newTodoText.value.trim()

  if (!trimmedText || isSubmitting.value) {
    return
  }

  isSubmitting.value = true

  try {
    emit('add', trimmedText)
    newTodoText.value = ''
  } catch (error) {
    console.error('Error adding todo:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSubmit()
  }
}
</script>

<template>
  <form class="todo-form" @submit.prevent="handleSubmit">
    <div class="form-group">
      <input v-model="newTodoText" ref="inputRef" type="text" class="todo-input" placeholder="What needs to be done?"
        :disabled="isSubmitting" @keydown="handleKeydown" maxlength="500" tabindex="0" />
      <button type="submit" class="todo-submit-btn" :disabled="!canSubmit" tabindex="0"
        :aria-label="isSubmitting ? 'Adding todo...' : 'Add todo'">
        <svg v-if="!isSubmitting" class="add-icon" viewBox="0 0 24 24">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        <div v-else class="submit-spinner"></div>
      </button>
    </div>
  </form>
</template>

<style scoped src="./TodoForm.scss"></style>
