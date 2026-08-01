<script setup lang="ts">
const model = defineModel<string>({ default: '' })

withDefaults(defineProps<{ type?: 'text' | 'email' | 'tel' | 'url' | 'month' | 'date' }>(), {
  type: 'text',
})
</script>

<template>
  <input v-model="model" :type="type" class="field-control" />
</template>
