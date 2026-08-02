<script setup lang="ts">
const letterStore = useLetterStore()
const { letters } = storeToRefs(letterStore)
const { exportLetter } = useDocumentExport()
const router = useRouter()

function open(id: string) {
  letterStore.selectLetter(id)
  router.push(`/lettres/${id}`)
}

function create() {
  const letter = letterStore.addLetter({ name: `Lettre ${letterStore.letters.length + 1}` })
  router.push(`/lettres/${letter.id}`)
}

function duplicate(id: string) {
  const copy = letterStore.duplicateLetter(id)
  if (copy) router.push(`/lettres/${copy.id}`)
}

function remove(id: string, name: string) {
  if (confirm(`Supprimer « ${name || 'Lettre sans nom'} » ? Vos données professionnelles sont conservées.`)) {
    letterStore.removeLetter(id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Lettres de motivation</h1>
        <p class="mt-1 text-sm text-muted">
          Une lettre par candidature. Vos coordonnées et votre parcours viennent du profil.
        </p>
      </div>
      <BaseButton variant="primary" size="sm" @click="create">
        <BaseIcon name="plus" :size="16" />
        Nouvelle lettre
      </BaseButton>
    </header>

    <TransitionGroup name="list" tag="div" class="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <LetterCard
        v-for="letter in letters"
        :key="letter.id"
        :letter="letter"
        @open="open(letter.id)"
        @download="exportLetter(letter.id)"
        @duplicate="duplicate(letter.id)"
        @remove="remove(letter.id, letter.name)"
      />
    </TransitionGroup>
  </div>
</template>
