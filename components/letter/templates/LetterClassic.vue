<script setup lang="ts">
import type { Letter } from '~/schemas/letter'
import type { Profile } from '~/schemas/profile'
import { fullName } from '~/utils/cvContent'
import { letterParagraphs, letterSubject, placeAndDate, recipientLines, senderLines } from '~/utils/letterContent'

/**
 * Classique professionnel — disposition postale française : expéditeur à
 * gauche, destinataire à droite, objet en évidence. Aucune fantaisie, une
 * police universelle : la lettre reste lisible par n'importe quel logiciel.
 */
const props = defineProps<{ letter: Letter; profile: Profile; accent: string }>()

const sender = computed(() => senderLines(props.profile.personal))
const recipient = computed(() => recipientLines(props.letter))
const body = computed(() => letterParagraphs(props.letter))
</script>

<template>
  <PaperSheet :accent="accent" class="classic">
    <div class="heads">
      <address class="sender">
        <p class="name">{{ fullName(profile.personal) || 'Prénom Nom' }}</p>
        <p v-if="profile.personal.title" class="role">{{ profile.personal.title }}</p>
        <p v-for="line in sender" :key="line">{{ line }}</p>
        <p v-for="link in profile.personal.links" :key="link.id">{{ link.label || link.url }}</p>
      </address>

      <address v-if="recipient.length" class="recipient">
        <p v-for="line in recipient" :key="line">{{ line }}</p>
      </address>
    </div>

    <p v-if="placeAndDate(letter)" class="date">{{ placeAndDate(letter) }}</p>

    <div class="subject">
      <p><span class="label">Objet :</span> {{ letterSubject(letter) }}</p>
      <p v-if="letter.reference" class="reference">Référence : {{ letter.reference }}</p>
    </div>

    <p class="salutation">{{ letter.salutation }}</p>

    <p v-for="(paragraph, index) in body" :key="index" class="text">{{ paragraph }}</p>

    <p v-if="letter.closing" class="text closing">{{ letter.closing }}</p>

    <p class="signature">{{ fullName(profile.personal) }}</p>
  </PaperSheet>
</template>

<style scoped>
/* Police universelle : aucun risque de substitution à l'analyse du document. */
.classic {
  padding: 20mm 22mm;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10.5pt;
  line-height: 1.6;
  color: #1a1a1a;
}

.heads {
  display: flex;
  justify-content: space-between;
  gap: 10mm;
}

address {
  font-style: normal;
  font-size: 9.5pt;
  color: #333333;
}

.sender {
  max-width: 80mm;
}

.name {
  font-size: 13pt;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #111111;
}

.role {
  margin-bottom: 2mm;
  color: var(--paper-accent);
}

.recipient {
  max-width: 75mm;
  text-align: right;
  padding-top: 12mm;
}

.date {
  margin-top: 12mm;
  text-align: right;
  font-size: 10pt;
}

.subject {
  margin-top: 10mm;
  border-bottom: 1.5pt solid var(--paper-accent);
  padding-bottom: 2mm;
}

.label {
  font-weight: 700;
}

.reference {
  margin-top: 1mm;
  font-size: 9pt;
  color: #555555;
}

.salutation {
  margin-top: 8mm;
}

.text {
  margin-top: 4mm;
  text-align: justify;
}

.closing {
  margin-top: 6mm;
}

.signature {
  margin-top: 10mm;
  text-align: right;
  font-weight: 700;
}
</style>
