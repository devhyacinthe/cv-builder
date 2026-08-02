<script setup lang="ts">
import type { NavItem } from '~/constants/navigation'

defineProps<{ item: NavItem }>()
</script>

<template>
  <NuxtLink
    v-if="item.enabled"
    :to="item.to"
    class="group flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted transition-all duration-200 hover:bg-canvas hover:text-ink"
    active-class="bg-brand-soft font-medium text-brand"
  >
    <BaseIcon :name="item.icon" :size="18" class="transition-transform duration-200 group-hover:-translate-y-px" />
    {{ item.label }}
  </NuxtLink>

  <span
    v-else
    class="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted/50"
    title="Module à venir"
  >
    <BaseIcon :name="item.icon" :size="18" />
    <span class="flex-1">{{ item.label }}</span>
    <span class="text-[10px] tracking-wide uppercase">bientôt</span>
  </span>
</template>
