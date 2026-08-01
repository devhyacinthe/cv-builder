<script setup lang="ts">
import { navigation } from '~/constants/navigation'

const profileStore = useProfileStore()
</script>

<template>
  <div class="min-h-screen lg:flex">
    <aside class="border-b border-line bg-surface lg:h-screen lg:w-64 lg:shrink-0 lg:border-r lg:border-b-0">
      <div class="flex items-center justify-between px-5 py-5 lg:block">
        <div>
          <p class="text-sm font-semibold tracking-tight text-ink">CV Builder</p>
          <p class="text-xs text-muted">Générateur de CV compatibles ATS</p>
        </div>
      </div>

      <nav class="px-3 pb-4">
        <ul class="space-y-0.5">
          <li v-for="item in navigation" :key="item.to">
            <NuxtLink
              v-if="item.enabled"
              :to="item.to"
              class="block rounded-md px-3 py-2 text-sm text-muted transition-colors hover:bg-canvas hover:text-ink"
              active-class="bg-brand-soft font-medium text-brand"
            >
              {{ item.label }}
            </NuxtLink>
            <span
              v-else
              class="flex items-center justify-between rounded-md px-3 py-2 text-sm text-muted/50"
              :title="'Module à venir'"
            >
              {{ item.label }}
              <span class="text-[10px] tracking-wide uppercase">bientôt</span>
            </span>
          </li>
        </ul>
      </nav>

      <p class="hidden px-5 text-xs text-muted lg:block">
        {{ profileStore.fullName || 'Profil non renseigné' }}
      </p>
    </aside>

    <main class="flex-1 lg:h-screen lg:overflow-y-auto">
      <div class="mx-auto max-w-5xl px-5 py-8">
        <slot />
      </div>
    </main>
  </div>
</template>
