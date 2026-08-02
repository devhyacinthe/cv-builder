<script setup lang="ts">
import { findTemplate } from '~/constants/cvTemplates'
import { documentProfile } from '~/utils/cvDocument'

/**
 * Page d'impression : uniquement le document, sans aucune interface.
 * C'est elle que le navigateur transforme en PDF.
 */
definePageMeta({ layout: false })

const route = useRoute()
const profileStore = useProfileStore()
const documentStore = useDocumentStore()

const document = computed(() => documentStore.byId(String(route.query.cv ?? '')) ?? documentStore.activeDocument)
const template = computed(() => findTemplate(document.value.templateId))
const rendered = computed(() => documentProfile(profileStore.profile, document.value))

useHead({ title: document.value.name || 'CV' })

const print = () => window.print()
const close = () => window.close()

/**
 * Les modèles à colonne peignent leur fond via `--page-bg`. Reporté sur la
 * racine du document, ce fond se répète sur chaque feuille imprimée : la
 * colonne latérale ne s'arrête plus au milieu de la deuxième page.
 */
function paintPageBackground() {
  const article = window.document.querySelector('article')
  if (!article) return
  const styles = getComputedStyle(article)
  const background = styles.getPropertyValue('--page-bg').trim()
  if (!background) return
  const root = window.document.documentElement.style
  root.setProperty('--cv-zoom', styles.getPropertyValue('--cv-zoom').trim() || '1')
  root.setProperty('--page-bg', background)
}

// Laisse aux polices et à la photo le temps d'être peintes avant la boîte de dialogue.
onMounted(() => {
  paintPageBackground()
  setTimeout(print, 400)
})
</script>

<template>
  <div class="print-screen">
    <div class="no-print mx-auto flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 py-4">
      <p class="text-sm text-muted">
        Dans la fenêtre d'impression, choisissez <strong class="text-ink">Enregistrer au format PDF</strong>,
        marges <strong class="text-ink">Aucune</strong>.
      </p>
      <div class="flex gap-2">
        <BaseButton size="sm" variant="primary" @click="print">
          <BaseIcon name="document" :size="16" />
          Télécharger
        </BaseButton>
        <BaseButton size="sm" @click="close">Fermer</BaseButton>
      </div>
    </div>

    <component :is="template.component" :profile="rendered" :accent="document.accent" />
  </div>
</template>

<style>
/* Styles volontairement globaux : ils pilotent la page imprimée entière. */
@page {
  size: A4;
  margin: 0;
}

.print-screen {
  background: #f4f5f7;
  min-height: 100vh;
}

.print-screen > article {
  margin: 0 auto 2rem;
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.12);
}

@media print {
  html {
    background: var(--page-bg, #ffffff);
    print-color-adjust: exact;
  }

  .no-print {
    display: none !important;
  }

  .print-screen {
    background: none;
    min-height: 0;
  }

  .print-screen > article {
    margin: 0;
    box-shadow: none;
  }
}
</style>
