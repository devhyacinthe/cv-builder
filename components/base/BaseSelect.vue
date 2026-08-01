<script setup lang="ts">
export interface SelectOption {
  value: string
  label: string
}

const model = defineModel<string>({ default: '' })

defineProps<{ options: SelectOption[]; placeholder?: string }>()
</script>

<template>
  <select v-model="model" class="field-control appearance-none bg-surface pr-8">
    <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>
