<script setup lang="ts">
import { formatBytes } from '~/utils/backup'
import { storedBytes } from '~/utils/storage'
import { formatStamp } from '~/utils/date'

const profileStore = useProfileStore()
const documentStore = useDocumentStore()
const letterStore = useLetterStore()
const { downloadBackup, restoreBackup, eraseEverything } = useBackup()

const fileInput = useTemplateRef<HTMLInputElement>('fileInput')
const result = ref<{ ok: boolean; message: string } | null>(null)

/** Le poids se lit dans le stockage : il n'est pas déductible de l'état. */
const bytes = ref(0)
const refreshSize = () => (bytes.value = storedBytes())
onMounted(refreshSize)

const summary = computed(() => [
  {
    label: 'Profil',
    value: profileStore.fullName || 'Non renseigné',
    hint: `${profileStore.profile.experiences.length} expériences · ${profileStore.profile.projects.length} projets`,
  },
  {
    label: 'CV',
    value: String(documentStore.documents.length),
    hint: `Dernier : ${formatStamp(documentStore.documents[0]?.updatedAt ?? '') || '—'}`,
  },
  {
    label: 'Lettres',
    value: String(letterStore.letters.length),
    hint: `Dernière : ${formatStamp(letterStore.letters[0]?.updatedAt ?? '') || '—'}`,
  },
  { label: 'Espace occupé', value: formatBytes(bytes.value), hint: 'Dans ce navigateur uniquement' },
])

async function onFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!confirm('La restauration remplace le profil, les CV et les lettres actuels. Continuer ?')) {
    input.value = ''
    return
  }

  result.value = await restoreBackup(file)
  input.value = ''
  refreshSize()
}

function erase() {
  if (!confirm('Effacer définitivement le profil, tous les CV et toutes les lettres ?')) return
  eraseEverything()
  result.value = { ok: true, message: 'Toutes les données ont été effacées.' }
  refreshSize()
}

function save() {
  downloadBackup()
  result.value = { ok: true, message: 'Sauvegarde téléchargée.' }
}
</script>

<template>
  <div class="space-y-6">
    <header>
      <h1 class="text-xl font-semibold tracking-tight">Mes données</h1>
      <p class="mt-1 text-sm text-muted">
        Tout est enregistré dans ce navigateur, et nulle part ailleurs. Une sauvegarde est le seul
        moyen de retrouver votre travail sur un autre appareil.
      </p>
    </header>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="item in summary" :key="item.label" class="rounded-lg border border-line bg-surface px-5 py-4">
        <p class="text-xs text-muted">{{ item.label }}</p>
        <p class="mt-1 truncate text-lg font-semibold tracking-tight">{{ item.value }}</p>
        <p class="mt-0.5 truncate text-xs text-muted">{{ item.hint }}</p>
      </div>
    </div>

    <Transition name="slide">
      <p
        v-if="result"
        class="rounded-lg border px-4 py-3 text-sm"
        :class="result.ok ? 'border-success/30 bg-success/5 text-success' : 'border-danger/30 bg-danger/5 text-danger'"
      >
        {{ result.message }}
      </p>
    </Transition>

    <div class="grid gap-4 lg:grid-cols-2">
      <BaseCard title="Sauvegarder" description="Un fichier unique contenant profil, CV et lettres.">
        <p class="text-sm text-muted">
          Conservez-le comme une archive : il se restaure à l'identique, sur cet appareil comme sur
          un autre.
        </p>
        <BaseButton variant="primary" class="mt-4" @click="save">
          <BaseIcon name="download" :size="16" />
          Télécharger ma sauvegarde
        </BaseButton>
      </BaseCard>

      <BaseCard title="Restaurer" description="Depuis un fichier de sauvegarde CV Builder.">
        <p class="text-sm text-muted">
          Le contenu actuel de ce navigateur sera remplacé. Un fichier étranger ou abîmé est refusé
          sans rien modifier.
        </p>
        <input ref="fileInput" type="file" accept="application/json,.json" class="hidden" @change="onFile" />
        <BaseButton class="mt-4" @click="fileInput?.click()">
          <BaseIcon name="upload" :size="16" />
          Choisir un fichier
        </BaseButton>
      </BaseCard>
    </div>

    <BaseCard title="Tout effacer" description="Action irréversible.">
      <p class="text-sm text-muted">
        Le profil, les CV et les lettres sont supprimés de ce navigateur. Téléchargez une sauvegarde
        avant si vous souhaitez pouvoir revenir en arrière.
      </p>
      <BaseButton variant="danger" class="mt-4" @click="erase">
        <BaseIcon name="trash" :size="16" />
        Effacer toutes mes données
      </BaseButton>
    </BaseCard>
  </div>
</template>
