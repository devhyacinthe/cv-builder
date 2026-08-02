<script setup lang="ts">
/**
 * Photo professionnelle. L'image est redimensionnée avant d'être stockée :
 * le profil tient ainsi largement dans le stockage local du navigateur.
 */
const model = defineModel<string>({ default: '' })

const MAX_SIZE = 512
const input = useTemplateRef<HTMLInputElement>('input')

function resize(source: HTMLImageElement): string {
  const scale = Math.min(1, MAX_SIZE / Math.max(source.width, source.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(source.width * scale)
  canvas.height = Math.round(source.height * scale)
  canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.85)
}

function onChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const image = new Image()
    image.onload = () => (model.value = resize(image))
    image.src = String(reader.result)
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="flex items-center gap-4">
    <div class="grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-line bg-canvas">
      <Transition name="fade" mode="out-in">
        <img v-if="model" :src="model" alt="Photo de profil" class="h-full w-full object-cover" />
        <BaseIcon v-else name="image" :size="22" class="text-muted" />
      </Transition>
    </div>

    <div class="space-y-2">
      <div class="flex gap-2">
        <BaseButton size="sm" @click="input?.click()">
          {{ model ? 'Remplacer' : 'Choisir une photo' }}
        </BaseButton>
        <BaseButton v-if="model" size="sm" variant="ghost" @click="model = ''">Retirer</BaseButton>
      </div>
      <p class="text-xs text-muted">
        Facultatif — plusieurs modèles de CV l'ignorent volontairement pour rester compatibles ATS.
      </p>
    </div>

    <input ref="input" type="file" accept="image/*" class="sr-only" @change="onChange" />
  </div>
</template>
