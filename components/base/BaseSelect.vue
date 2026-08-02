<script setup lang="ts" generic="T extends string">
const model = defineModel<T>()

defineProps<{ options: readonly { value: T; label: string }[]; placeholder?: string }>()
</script>

<template>
  <select v-model="model" class="field-control cursor-pointer bg-surface">
    <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
