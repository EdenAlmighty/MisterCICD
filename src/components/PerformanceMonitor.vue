<script setup lang="ts">
defineOptions({
  name: 'PerformanceMonitor'
})

import { ref, onMounted, onUnmounted, computed } from 'vue'

// Check if we're in development mode
const isDev = computed(() => import.meta.env.DEV)

// Performance metrics
const metrics = ref({
  loadTime: 0,
  memoryUsage: 0,
  bundleSize: 0,
  renderTime: 0
})

let observer: PerformanceObserver | null = null

onMounted(() => {
  // Measure page load time
  if (performance.timing) {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart
    metrics.value.loadTime = loadTime
  }

  // Monitor memory usage (if available)
  if ('memory' in performance) {
    const memory = (performance as Performance & { memory: { usedJSHeapSize: number } }).memory
    metrics.value.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024)
  }

  // Monitor bundle size
  const scripts = document.querySelectorAll('script[src]')
  let totalSize = 0
  scripts.forEach(script => {
    const src = script.getAttribute('src')
    if (src && src.includes('assets/')) {
      // Estimate size based on filename pattern
      totalSize += 50 // Rough estimate in KB
    }
  })
  metrics.value.bundleSize = totalSize

  // Monitor render performance
  observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'measure') {
        metrics.value.renderTime = Math.round(entry.duration)
      }
    }
  })

  try {
    observer.observe({ entryTypes: ['measure'] })
  } catch {
    console.warn('PerformanceObserver not supported')
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div class="performance-monitor" v-if="isDev">
    <div class="monitor-header">
      <h4>Performance Metrics</h4>
    </div>
    <div class="monitor-metrics">
      <div class="metric">
        <span class="metric-label">Load Time:</span>
        <span class="metric-value">{{ metrics.loadTime }}ms</span>
      </div>
      <div class="metric">
        <span class="metric-label">Memory:</span>
        <span class="metric-value">{{ metrics.memoryUsage }}MB</span>
      </div>
      <div class="metric">
        <span class="metric-label">Bundle:</span>
        <span class="metric-value">{{ metrics.bundleSize }}KB</span>
      </div>
      <div class="metric">
        <span class="metric-label">Render:</span>
        <span class="metric-value">{{ metrics.renderTime }}ms</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.performance-monitor {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 16px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 12px;
  z-index: 9999;
  min-width: 200px;
}

.monitor-header h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #60a5fa;
}

.monitor-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  color: #9ca3af;
}

.metric-value {
  color: #10b981;
  font-weight: 600;
}
</style>
