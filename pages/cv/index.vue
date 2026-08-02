<script setup lang="ts">
const documentStore = useDocumentStore()
const { documents } = storeToRefs(documentStore)
const { exportCv } = useCvExport()
const router = useRouter()

function open(id: string) {
  documentStore.selectDocument(id)
  router.push(`/cv/${id}`)
}

function create() {
  const document = documentStore.addDocument({ name: `CV ${documentStore.documents.length + 1}` })
  router.push(`/cv/${document.id}`)
}

function duplicate(id: string) {
  const copy = documentStore.duplicateDocument(id)
  if (copy) router.push(`/cv/${copy.id}`)
}

function remove(id: string, name: string) {
  if (confirm(`Supprimer « ${name || 'CV sans nom'} » ? Vos données professionnelles sont conservées.`)) {
    documentStore.removeDocument(id)
  }
}
</script>

<template>
  <div class="space-y-6">
    <header class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">Mes CV</h1>
        <p class="mt-1 text-sm text-muted">
          Chaque CV garde son modèle et ses rubriques. Le contenu reste celui de votre profil.
        </p>
      </div>
      <BaseButton variant="primary" size="sm" @click="create">
        <BaseIcon name="plus" :size="16" />
        Nouveau CV
      </BaseButton>
    </header>

    <TransitionGroup
      name="list"
      tag="div"
      class="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <DocumentCard
        v-for="document in documents"
        :key="document.id"
        :document="document"
        @open="open(document.id)"
        @download="exportCv(document.id)"
        @duplicate="duplicate(document.id)"
        @remove="remove(document.id, document.name)"
      />
    </TransitionGroup>
  </div>
</template>
