<script setup lang="ts">
import { ref } from 'vue'
import { useLeadsStore } from '@/stores/useLeadsStore'
import { useStatusConfig } from '@/composables/useStatusConfig'
import type { LeadStatus } from '@/types/lead'

const props = defineProps<{
  selectedIds: string[]
}>()

const emit = defineEmits<{
  clear: []
}>()

const store = useLeadsStore()
const { allStatuses, getStatusLabel } = useStatusConfig()

const statusDialog = ref(false)
const chosenStatus = ref<LeadStatus>('New')

function applyStatus() {
  store.bulkUpdateStatus(props.selectedIds, chosenStatus.value)
  statusDialog.value = false
  emit('clear')
}
</script>

<template>
  <v-sheet
    v-if="selectedIds.length > 0"
    color="blue-darken-4"
    class="d-flex align-center px-4 py-2 rounded-lg mb-3 gap-4"
    elevation="2"
  >
    <span class="text-white text-body-2 font-weight-medium">
      {{ selectedIds.length }} selected
    </span>
    <v-spacer />
    <v-btn
      variant="tonal"
      color="white"
      size="small"
      @click="statusDialog = true"
    >
      Change Status
    </v-btn>
    <v-btn
      icon="mdi-close"
      variant="text"
      color="white"
      size="small"
      @click="emit('clear')"
    />

    <v-dialog v-model="statusDialog" max-width="360">
      <v-card>
        <v-card-title>Change Status</v-card-title>
        <v-card-text>
          <v-select
            v-model="chosenStatus"
            :items="allStatuses.map((s) => ({ title: getStatusLabel(s), value: s }))"
            label="New status"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="statusDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="applyStatus">Apply</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-sheet>
</template>
