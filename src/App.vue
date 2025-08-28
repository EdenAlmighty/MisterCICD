<script setup lang="ts">
import { RouterView } from 'vue-router'
import PerformanceMonitor from '@/components/PerformanceMonitor.vue'
</script>

<template>
  <RouterView />
  <PerformanceMonitor />
</template>

<style scoped>
/* App-level styles are minimal since TodoPage handles the layout */
</style>
