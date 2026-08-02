<script setup lang="ts">
import { profileSections } from '~/constants/profileSections'

const active = defineModel<string>({ required: true })

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })

const { profile } = storeToRefs(useProfileStore())
</script>

<template>
  <nav>
    <ul class="flex flex-wrap" :class="compact ? 'gap-1' : 'gap-1.5'">
      <li v-for="section in profileSections" :key="section.key">
        <button
          type="button"
          class="flex items-center rounded-full border whitespace-nowrap transition-all duration-200"
          :class="[
            compact ? 'gap-1.5 px-2.5 py-1.5 text-xs' : 'gap-2 px-3.5 py-2 text-sm',
            active === section.key
              ? 'border-brand bg-brand text-white shadow-sm'
              : 'border-line bg-surface text-muted hover:border-brand/30 hover:text-ink',
          ]"
          @click="active = section.key"
        >
          <BaseIcon :name="section.icon" :size="compact ? 14 : 16" />
          {{ section.label }}
          <span
            v-if="section.count?.(profile)"
            class="rounded-full px-1.5 text-[11px] tabular-nums"
            :class="active === section.key ? 'bg-white/20' : 'bg-canvas'"
          >
            {{ section.count(profile) }}
          </span>
        </button>
      </li>
    </ul>
  </nav>
</template>
