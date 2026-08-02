<script setup lang="ts">
const { profile } = storeToRefs(useProfileStore())
const summary = computed(() => profile.value.summary)

const words = computed(() => summary.value.content.trim().split(/\s+/).filter(Boolean).length)
</script>

<template>
  <BaseCard title="Résumé professionnel" description="Premier paragraphe lu par un recruteur comme par un ATS.">
    <div class="space-y-4">
      <BaseField v-slot="{ id }" label="Accroche" hint="Une ligne, affichée sous votre titre par certains modèles.">
        <BaseInput :id="id" v-model="summary.headline" />
      </BaseField>

      <BaseField v-slot="{ id }" label="Résumé" :hint="`${words} mots — visez 60 à 90 mots.`">
        <BaseTextarea :id="id" v-model="summary.content" :rows="6" />
      </BaseField>

      <BaseField v-slot="{ id }" label="Objectif de carrière" hint="Facultatif — utile pour les candidatures ciblées.">
        <BaseTextarea :id="id" v-model="summary.objective" :rows="3" />
      </BaseField>
    </div>
  </BaseCard>
</template>
