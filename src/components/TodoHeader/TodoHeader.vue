<script setup lang="ts">
defineOptions({
  name: 'TodoHeader'
})

// Props with concise syntax
withDefaults(defineProps<{
  title?: string
  subtitle?: string
}>(), {
  title: 'Todo App',
  subtitle: 'Manage your tasks efficiently'
})
</script>

<template>
  <header class="todo-header">
    <h1 class="todo-title">{{ title }}</h1>
    <p class="todo-subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped src="./TodoHeader.scss"></style>
