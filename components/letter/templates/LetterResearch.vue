<script setup lang="ts">
import type { Letter } from '~/schemas/letter'
import type { Profile } from '~/schemas/profile'
import { fullName } from '~/utils/cvContent'
import { letterParagraphs, letterSubject, placeAndDate, recipientLines, senderLines } from '~/utils/letterContent'

/**
 * Académique / Recherche — en-tête centré à la manière d'un papier à lettre
 * institutionnel, typographie à empattements, marges larges et paragraphes
 * indentés : les codes de la correspondance universitaire.
 */
const props = defineProps<{ letter: Letter; profile: Profile; accent: string }>()

const sender = computed(() => senderLines(props.profile.personal))
const recipient = computed(() => recipientLines(props.letter))
const body = computed(() => letterParagraphs(props.letter))
</script>

<template>
  <PaperSheet :accent="accent" class="research">
    <header class="head">
      <p class="name">{{ fullName(profile.personal) || 'Prénom Nom' }}</p>
      <p v-if="profile.personal.title" class="role">{{ profile.personal.title }}</p>
      <p v-if="sender.length" class="contacts">{{ sender.join(' — ') }}</p>
    </header>

    <div class="meta">
      <address v-if="recipient.length" class="recipient">
        <p v-for="line in recipient" :key="line">{{ line }}</p>
      </address>
      <p v-if="placeAndDate(letter)" class="date">{{ placeAndDate(letter) }}</p>
    </div>

    <p class="subject">
      <span class="label">Objet :</span> <span class="value">{{ letterSubject(letter) }}</span>
    </p>
    <p v-if="letter.reference" class="reference">Référence : {{ letter.reference }}</p>

    <p class="salutation">{{ letter.salutation }}</p>

    <p v-for="(paragraph, index) in body" :key="index" class="text">{{ paragraph }}</p>

    <p v-if="letter.closing" class="text closing">{{ letter.closing }}</p>

    <p class="signature">{{ fullName(profile.personal) }}</p>
  </PaperSheet>
</template>

<style scoped>
.research {
  padding: 22mm 25mm;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 10.5pt;
  line-height: 1.7;
  color: #1a1a1a;
}

.head {
  text-align: center;
  border-bottom: 0.75pt solid var(--paper-accent);
  padding-bottom: 4mm;
}

.name {
  font-size: 15pt;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.role {
  margin-top: 1mm;
  font-size: 10pt;
  font-style: italic;
  color: #444444;
}

.contacts {
  margin-top: 2mm;
  font-size: 9pt;
  color: #555555;
}

.meta {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10mm;
  margin-top: 12mm;
}

.recipient {
  font-style: normal;
  font-size: 10pt;
  max-width: 80mm;
}

.date {
  font-size: 10pt;
  text-align: right;
  white-space: nowrap;
}

.subject {
  margin-top: 12mm;
}

.label {
  font-weight: 700;
}

.value {
  text-decoration: underline;
  text-underline-offset: 2pt;
}

.reference {
  margin-top: 1mm;
  font-size: 9pt;
  color: #555555;
}

.salutation {
  margin-top: 8mm;
}

/* Alinéa : la convention de la correspondance académique française. */
.text {
  margin-top: 3mm;
  text-align: justify;
  text-indent: 8mm;
}

.closing {
  margin-top: 6mm;
}

.signature {
  margin-top: 12mm;
  text-align: right;
}
</style>
