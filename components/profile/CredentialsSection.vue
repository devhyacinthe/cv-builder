<script setup lang="ts">
import { createCertification, createPublication } from '~/utils/factories'
import { formatMonth } from '~/utils/date'

const {
  items: certifications,
  add: addCertification,
  remove: removeCertification,
  move: moveCertification,
} = useProfileList('certifications', createCertification)

const {
  items: publications,
  add: addPublication,
  remove: removePublication,
  move: movePublication,
} = useProfileList('publications', createPublication)
</script>

<template>
  <div class="space-y-4">
    <BaseCard title="Certifications" description="Certifications professionnelles et techniques.">
      <EditableList
        :items="certifications"
        add-label="Ajouter une certification"
        empty="Aucune certification enregistrée."
        @add="addCertification"
        @remove="removeCertification"
        @move="moveCertification"
      >
        <template #summary="{ item }">
          <span class="block truncate text-sm font-medium">{{ item.name || 'Nouvelle certification' }}</span>
          <span class="block truncate text-xs text-muted">
            {{ [item.issuer, formatMonth(item.date)].filter(Boolean).join(' · ') }}
          </span>
        </template>

        <template #default="{ item }">
          <div class="grid gap-4 sm:grid-cols-2">
            <BaseField v-slot="{ id }" label="Intitulé">
              <BaseInput :id="id" v-model="item.name" />
            </BaseField>
            <BaseField v-slot="{ id }" label="Organisme">
              <BaseInput :id="id" v-model="item.issuer" />
            </BaseField>
            <BaseField v-slot="{ id }" label="Date d'obtention">
              <BaseInput :id="id" v-model="item.date" type="month" />
            </BaseField>
            <BaseField v-slot="{ id }" label="Lien de vérification">
              <BaseInput :id="id" v-model="item.url" type="url" />
            </BaseField>
          </div>
        </template>
      </EditableList>
    </BaseCard>

    <BaseCard title="Publications" description="Utilisées par le modèle académique / recherche.">
      <EditableList
        :items="publications"
        add-label="Ajouter une publication"
        empty="Aucune publication enregistrée."
        @add="addPublication"
        @remove="removePublication"
        @move="movePublication"
      >
        <template #summary="{ item }">
          <span class="block truncate text-sm font-medium">{{ item.title || 'Nouvelle publication' }}</span>
          <span class="block truncate text-xs text-muted">
            {{ [item.venue, formatMonth(item.date)].filter(Boolean).join(' · ') }}
          </span>
        </template>

        <template #default="{ item }">
          <div class="space-y-4">
            <BaseField v-slot="{ id }" label="Titre">
              <BaseInput :id="id" v-model="item.title" />
            </BaseField>
            <div class="grid gap-4 sm:grid-cols-3">
              <BaseField v-slot="{ id }" label="Auteurs">
                <BaseInput :id="id" v-model="item.authors" />
              </BaseField>
              <BaseField v-slot="{ id }" label="Conférence / revue">
                <BaseInput :id="id" v-model="item.venue" />
              </BaseField>
              <BaseField v-slot="{ id }" label="Date">
                <BaseInput :id="id" v-model="item.date" type="month" />
              </BaseField>
            </div>
            <BaseField v-slot="{ id }" label="Lien">
              <BaseInput :id="id" v-model="item.url" type="url" />
            </BaseField>
          </div>
        </template>
      </EditableList>
    </BaseCard>
  </div>
</template>
