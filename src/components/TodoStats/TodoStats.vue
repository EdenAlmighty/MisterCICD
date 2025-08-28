<script setup lang="ts">
defineOptions({
  name: 'TodoStats'
})

// Props with concise syntax
defineProps<{
  total: number
  active: number
  completed: number
}>()
</script>

<template>
  <div class="todo-stats">
    <span>Total:{{ total }}</span>
    <span>Active:{{ active }}</span>
    <span>Completed:{{ completed }}</span>
  </div>
</template>

<style scoped src="./TodoStats.scss"></style>
