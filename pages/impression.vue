<script setup lang="ts">
import { findTemplate } from '~/constants/cvTemplates'
import { findLetterTemplate } from '~/constants/letterTemplates'
import { documentProfile } from '~/utils/cvDocument'

/**
 * Page d'impression : uniquement le document, sans aucune interface.
 * C'est elle que le navigateur transforme en PDF.
 */
definePageMeta({ layout: false })

const route = useRoute()
const profileStore = useProfileStore()
const documentStore = useDocumentStore()
const letterStore = useLetterStore()

/** L'URL désigne le document à imprimer : `?cv=` ou `?lettre=`. */
const printed = computed(() => {
  const letter = letterStore.byId(String(route.query.lettre ?? ''))
  if (letter) {
    return {
      title: letter.name || 'Lettre de motivation',
      component: findLetterTemplate(letter.templateId).component,
      props: { letter, profile: profileStore.profile, accent: letter.accent },
    }
  }

  const document = documentStore.byId(String(route.query.cv ?? '')) ?? documentStore.activeDocument
  return {
    title: document.name || 'CV',
    component: findTemplate(document.templateId).component,
    props: { profile: documentProfile(profileStore.profile, document), accent: document.accent },
  }
})

useHead({ title: () => printed.value.title })

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
  root.setProperty('--paper-zoom', styles.getPropertyValue('--paper-zoom').trim() || '1')
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

    <component :is="printed.component" v-bind="printed.props" />
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
