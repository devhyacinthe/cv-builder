<script setup lang="ts">
import { navigation } from '~/constants/navigation'

const profileStore = useProfileStore()
const route = useRoute()

const menuOpen = ref(false)
watch(() => route.fullPath, () => (menuOpen.value = false))

const initials = computed(() => {
  const { firstName, lastName } = profileStore.profile.personal
  return `${firstName.at(0) ?? ''}${lastName.at(0) ?? ''}`.toUpperCase() || '—'
})
</script>

<template>
  <div class="min-h-screen lg:flex">
    <aside
      class="sticky top-0 z-20 border-b border-line bg-surface/85 backdrop-blur-sm lg:flex lg:h-screen lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0 lg:backdrop-blur-none"
    >
      <div class="flex items-center justify-between px-5 py-4">
        <NuxtLink to="/" class="group flex items-center gap-2.5">
          <span
            class="grid h-9 w-9 place-items-center rounded-lg bg-brand text-sm font-semibold text-white transition-transform duration-200 group-hover:scale-105"
          >
            CV
          </span>
          <span>
            <span class="block text-sm font-semibold tracking-tight">CV Builder</span>
            <span class="block text-[11px] text-muted">Optimisé ATS</span>
          </span>
        </NuxtLink>

        <button
          class="rounded-md p-2 text-muted transition-colors hover:bg-canvas hover:text-ink lg:hidden"
          :aria-expanded="menuOpen"
          aria-label="Ouvrir la navigation"
          @click="menuOpen = !menuOpen"
        >
          <BaseIcon :name="menuOpen ? 'close' : 'dashboard'" />
        </button>
      </div>

      <nav class="hidden flex-1 px-3 pb-4 lg:block">
        <ul class="space-y-0.5">
          <li v-for="item in navigation" :key="item.to">
            <AppNavLink :item="item" />
          </li>
        </ul>
      </nav>

      <Transition name="collapse">
        <nav v-if="menuOpen" class="lg:hidden">
          <ul class="space-y-0.5 px-3 pb-4">
            <li v-for="item in navigation" :key="item.to">
              <AppNavLink :item="item" />
            </li>
          </ul>
        </nav>
      </Transition>

      <div class="hidden items-center gap-3 border-t border-line px-5 py-4 lg:flex">
        <span class="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">
          {{ initials }}
        </span>
        <span class="truncate text-xs text-muted">
          {{ profileStore.fullName || 'Profil non renseigné' }}
        </span>
      </div>
    </aside>

    <main class="flex-1 lg:h-screen lg:overflow-y-auto">
      <div class="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>
