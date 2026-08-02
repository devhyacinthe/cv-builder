<script setup lang="ts">
import { socialPlatforms } from '~/schemas/profile'
import { createSocialLink } from '~/utils/factories'
import { moveById, removeById } from '~/utils/collection'

const { profile } = storeToRefs(useProfileStore())
const personal = computed(() => profile.value.personal)

const platformOptions = socialPlatforms.map((platform) => ({
  value: platform,
  label: { linkedin: 'LinkedIn', github: 'GitHub', website: 'Site web', twitter: 'X / Twitter', other: 'Autre' }[platform],
}))
</script>

<template>
  <div class="space-y-4">
    <BaseCard title="Informations générales" description="Affichées en tête de chaque CV et lettre.">
      <div class="space-y-5">
        <PhotoInput v-model="personal.photo" />

        <div class="grid gap-4 sm:grid-cols-2">
          <BaseField v-slot="{ id }" label="Prénom" required>
            <BaseInput :id="id" v-model="personal.firstName" />
          </BaseField>
          <BaseField v-slot="{ id }" label="Nom" required>
            <BaseInput :id="id" v-model="personal.lastName" />
          </BaseField>
          <BaseField v-slot="{ id }" label="Titre professionnel" hint="Ex. : Data Engineer" required>
            <BaseInput :id="id" v-model="personal.title" />
          </BaseField>
          <BaseField v-slot="{ id }" label="Localisation">
            <BaseInput :id="id" v-model="personal.location" />
          </BaseField>
          <BaseField v-slot="{ id }" label="Email" required>
            <BaseInput :id="id" v-model="personal.email" type="email" />
          </BaseField>
          <BaseField v-slot="{ id }" label="Téléphone">
            <BaseInput :id="id" v-model="personal.phone" type="tel" />
          </BaseField>
        </div>
      </div>
    </BaseCard>

    <BaseCard title="Informations complémentaires" description="Utilisées par les modèles à colonne latérale.">
      <div class="grid gap-4 sm:grid-cols-3">
        <BaseField v-slot="{ id }" label="Nationalité">
          <BaseInput :id="id" v-model="personal.nationality" />
        </BaseField>
        <BaseField v-slot="{ id }" label="Date de naissance">
          <BaseInput :id="id" v-model="personal.birthDate" type="month" />
        </BaseField>
        <BaseField v-slot="{ id }" label="Permis">
          <BaseInput :id="id" v-model="personal.drivingLicence" />
        </BaseField>
      </div>
    </BaseCard>

    <BaseCard title="Liens professionnels">
      <EditableList
        :items="personal.links"
        add-label="Ajouter un lien"
        empty="Aucun lien pour le moment."
        @add="personal.links.push(createSocialLink())"
        @remove="(id) => removeById(personal.links, id)"
        @move="(id, offset) => moveById(personal.links, id, offset)"
      >
        <template #summary="{ item }">
          <span class="block truncate text-sm font-medium">{{ item.label || 'Nouveau lien' }}</span>
          <span class="block truncate text-xs text-muted">{{ item.url }}</span>
        </template>

        <template #default="{ item }">
          <div class="grid gap-4 sm:grid-cols-3">
            <BaseField v-slot="{ id }" label="Plateforme">
              <BaseSelect :id="id" v-model="item.platform" :options="platformOptions" />
            </BaseField>
            <BaseField v-slot="{ id }" label="Libellé affiché">
              <BaseInput :id="id" v-model="item.label" />
            </BaseField>
            <BaseField v-slot="{ id }" label="URL">
              <BaseInput :id="id" v-model="item.url" type="url" />
            </BaseField>
          </div>
        </template>
      </EditableList>
    </BaseCard>
  </div>
</template>
