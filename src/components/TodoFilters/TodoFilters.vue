<script setup lang="ts">
defineOptions({
  name: 'TodoFilters'
})

// Props and emits with concise syntax
defineProps<{
  currentFilter: 'all' | 'active' | 'completed'
  searchValue?: string
}>()

const emit = defineEmits<{
  filterChange: [filter: 'all' | 'active' | 'completed']
  searchChange: [search: string]
}>()

// Methods
const handleFilterClick = (filter: 'all' | 'active' | 'completed') => {
  emit('filterChange', filter)
}

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('searchChange', target.value)
}
</script>

<template>
  <div class="todo-filters">
    <div class="filter-buttons">
      <button @click="handleFilterClick('all')" :class="{ active: currentFilter === 'all' }">
        All
      </button>
      <button @click="handleFilterClick('active')" :class="{ active: currentFilter === 'active' }">
        Active
      </button>
      <button @click="handleFilterClick('completed')" :class="{ active: currentFilter === 'completed' }">
        Completed
      </button>
    </div>

    <input type="text" placeholder="Search todos..." class="search-input" :value="searchValue || ''"
      @input="handleSearchInput" />
  </div>
</template>

<style scoped src="./TodoFilters.scss"></style>
