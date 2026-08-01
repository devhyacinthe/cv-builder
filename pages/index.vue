<script setup lang="ts">
const profileStore = useProfileStore()
const { profile } = storeToRefs(profileStore)

const sections = computed(() => [
  { label: 'Expériences', count: profile.value.experiences.length },
  { label: 'Formations', count: profile.value.educations.length },
  { label: 'Projets', count: profile.value.projects.length },
  { label: 'Catégories de compétences', count: profile.value.skillCategories.length },
  { label: 'Langues', count: profile.value.languages.length },
  { label: 'Certifications', count: profile.value.certifications.length },
])

function confirmReset() {
  if (confirm('Effacer définitivement toutes les données du profil ?')) profileStore.resetProfile()
}
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-xl font-semibold tracking-tight">Tableau de bord</h1>
      <p class="mt-1 text-sm text-muted">
        Vos données sont enregistrées dans ce navigateur et réutilisées par tous vos CV.
      </p>
    </header>

    <BaseCard title="Identité" description="Informations affichées en tête de chaque document.">
      <div class="grid gap-4 sm:grid-cols-2">
        <BaseField v-slot="{ id }" label="Prénom">
          <BaseInput :id="id" v-model="profile.personal.firstName" />
        </BaseField>
        <BaseField v-slot="{ id }" label="Nom">
          <BaseInput :id="id" v-model="profile.personal.lastName" />
        </BaseField>
        <BaseField v-slot="{ id }" label="Titre professionnel">
          <BaseInput :id="id" v-model="profile.personal.title" />
        </BaseField>
        <BaseField v-slot="{ id }" label="Email">
          <BaseInput :id="id" v-model="profile.personal.email" type="email" />
        </BaseField>
      </div>
    </BaseCard>

    <BaseCard title="Contenu du profil" description="Les sections se remplissent depuis l'éditeur.">
      <dl class="grid gap-3 sm:grid-cols-3">
        <div v-for="section in sections" :key="section.label" class="rounded-md border border-line px-4 py-3">
          <dt class="text-xs text-muted">{{ section.label }}</dt>
          <dd class="mt-1 text-lg font-semibold tabular-nums">{{ section.count }}</dd>
        </div>
      </dl>
    </BaseCard>

    <BaseCard title="Données locales">
      <template #actions>
        <BaseButton variant="danger" size="sm" @click="confirmReset">Réinitialiser</BaseButton>
      </template>
      <p class="text-sm text-muted">
        Aucune information n'est envoyée sur un serveur. Fermer puis rouvrir le navigateur conserve le profil.
      </p>
    </BaseCard>
  </div>
</template>
