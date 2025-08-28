<script setup lang="ts">
defineOptions({
  name: 'TodoActions'
})

// Props and emits with concise syntax
const props = defineProps<{
  hasCompletedTodos: boolean
}>()

const emit = defineEmits<{
  clearCompleted: []
}>()

// Methods
const handleClearCompleted = () => {
  emit('clearCompleted')
}
</script>

<template>
  <div v-if="hasCompletedTodos" class="todo-actions">
    <button @click="handleClearCompleted" class="clear-completed-btn">
      Clear completed
    </button>
  </div>
</template>

<style scoped src="./TodoActions.scss"></style>
