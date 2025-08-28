<script setup lang="ts">
defineOptions({
  name: 'TodoError'
})

// Props and emits with concise syntax
defineProps<{
  message: string
}>()

const emit = defineEmits<{
  clear: []
}>()

// Methods
const handleClear = () => {
  emit('clear')
}
</script>

<template>
  <div class="error-message">
    <p>{{ message }}</p>
    <button @click="handleClear" class="error-close-btn" aria-label="Clear error">
      <svg viewBox="0 0 24 24" class="icon">
        <path
          d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      </svg>
    </button>
  </div>
</template>

<style scoped src="./TodoError.scss"></style>
