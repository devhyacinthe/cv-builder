<script setup lang="ts">
import { findSection, profileSections } from '~/constants/profileSections'

const route = useRoute()
const router = useRouter()

// La section active vit dans l'URL : les liens du tableau de bord y renvoient.
const activeKey = computed({
  get() {
    const requested = String(route.query.section ?? '')
    return profileSections.some((section) => section.key === requested) ? requested : profileSections[0]!.key
  },
  set(key: string) {
    router.replace({ query: { ...route.query, section: key } })
  },
})

const activeSection = computed(() => findSection(activeKey.value))
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Profil professionnel</h1>
        <p class="mt-1 text-sm text-muted">
          Saisi une seule fois, réutilisé par tous vos CV et lettres. Enregistrement automatique.
        </p>
      </div>
      <BaseButton size="sm" to="/cv">
        <BaseIcon name="document" :size="16" />
        Voir le rendu
      </BaseButton>
    </header>

    <SectionTabs v-model="activeKey" />

    <Transition name="slide" mode="out-in">
      <component :is="activeSection.component" :key="activeSection.key" />
    </Transition>
  </div>
</template>
