<script setup lang="ts">
import { useFormatters } from '@/composables/useFormatters'
import type { LeadNote } from '@/types/lead'

defineProps<{ notes: LeadNote[] }>()

const { formatDate } = useFormatters()

const noteIcon: Record<LeadNote['type'], string> = {
  call: 'mdi-phone',
  email: 'mdi-email',
  comment: 'mdi-comment',
}
</script>

<template>
  <v-list v-if="notes.length > 0" lines="two">
    <v-list-item
      v-for="note in notes"
      :key="note.id"
      :prepend-icon="noteIcon[note.type]"
    >
      <template #title>
        <span class="text-body-2">{{ note.text }}</span>
      </template>
      <template #subtitle>
        {{ note.author }} · {{ formatDate(note.createdAt) }}
      </template>
    </v-list-item>
  </v-list>
  <v-alert v-else type="info" variant="tonal" class="mt-2">
    No notes yet.
  </v-alert>
</template>
