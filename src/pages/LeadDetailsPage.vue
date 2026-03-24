<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/useLeadsStore'
import { useFormatters } from '@/composables/useFormatters'
import { useStatusConfig } from '@/composables/useStatusConfig'
import NotesList from '@/components/leads/NotesList.vue'
import AddNoteForm from '@/components/leads/AddNoteForm.vue'
import type { LeadStatus } from '@/types/lead'

const route = useRoute()
const router = useRouter()
const store = useLeadsStore()
const { formatDate, formatCurrency } = useFormatters()
const { getStatusColor, getStatusLabel, allStatuses } = useStatusConfig()

onMounted(() => {
  if (store.leads.length === 0) store.loadLeads()
})

const lead = computed(() =>
  store.leads.find((l) => l.id === route.params.id),
)

const notes = computed(() =>
  store.notesByLeadId[route.params.id as string] ?? [],
)

const statusModel = ref<LeadStatus>('New')
const saving = ref(false)
const snackbar = ref(false)

const statusOptions = allStatuses.map((s) => ({ title: getStatusLabel(s), value: s }))

// sync statusModel when lead loads asynchronously
watch(lead, (l) => { if (l) statusModel.value = l.status }, { immediate: true })

async function saveStatus() {
  if (!lead.value) return
  saving.value = true
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 400))
  store.updateLeadStatus(lead.value.id, statusModel.value)
  saving.value = false
  snackbar.value = true
}
</script>

<template>
  <v-container class="py-6" style="max-width: 900px">
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-4"
      @click="router.push('/leads')"
    >
      Back to Leads
    </v-btn>

    <template v-if="lead">
      <v-card class="mb-4" elevation="1">
        <v-card-title class="d-flex align-center gap-3">
          <span>{{ lead.fullName }}</span>
          <v-chip :color="getStatusColor(lead.status)" label size="small">
            {{ getStatusLabel(lead.status) }}
          </v-chip>
        </v-card-title>
        <v-divider />
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <v-list density="compact">
                <v-list-item prepend-icon="mdi-phone" :subtitle="lead.phone" title="Phone" />
                <v-list-item
                  v-if="lead.email"
                  prepend-icon="mdi-email"
                  :subtitle="lead.email"
                  title="Email"
                />
                <v-list-item prepend-icon="mdi-account" :subtitle="lead.owner" title="Owner" />
                <v-list-item prepend-icon="mdi-source-branch" :subtitle="lead.source" title="Source" />
              </v-list>
            </v-col>
            <v-col cols="12" md="6">
              <v-list density="compact">
                <v-list-item
                  prepend-icon="mdi-currency-usd"
                  :subtitle="formatCurrency(lead.budget)"
                  title="Budget"
                />
                <v-list-item
                  prepend-icon="mdi-calendar-plus"
                  :subtitle="formatDate(lead.createdAt)"
                  title="Created"
                />
                <v-list-item
                  prepend-icon="mdi-clock-outline"
                  :subtitle="formatDate(lead.lastActivityAt)"
                  title="Last Activity"
                />
              </v-list>
              <div v-if="lead.tags.length > 0" class="px-4 mt-2">
                <div class="text-caption text-medium-emphasis mb-1">Tags</div>
                <v-chip
                  v-for="tag in lead.tags"
                  :key="tag"
                  size="small"
                  class="mr-1 mb-1"
                  variant="tonal"
                >
                  {{ tag }}
                </v-chip>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mb-4" elevation="1">
        <v-card-title>Change Status</v-card-title>
        <v-card-text>
          <v-row align="center">
            <v-col cols="12" md="5">
              <v-select
                v-model="statusModel"
                :items="statusOptions"
                label="Status"
                hide-details
              />
            </v-col>
            <v-col cols="12" md="auto">
              <v-btn color="primary" :loading="saving" @click="saveStatus">
                Save
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card elevation="1">
        <v-card-title>Notes</v-card-title>
        <v-divider />
        <v-card-text>
          <AddNoteForm :lead-id="lead.id" />
          <v-divider class="my-4" />
          <NotesList :notes="notes" />
        </v-card-text>
      </v-card>
    </template>

    <template v-else-if="!store.loading">
      <v-alert type="error" title="Lead not found" text="The lead you are looking for does not exist." class="mb-4" />
      <v-btn color="primary" @click="router.push('/leads')">Back to Leads</v-btn>
    </template>

    <div v-else class="d-flex justify-center mt-16">
      <v-progress-circular indeterminate color="primary" size="56" />
    </div>

    <v-snackbar v-model="snackbar" color="success" :timeout="2500">
      Status updated successfully
      <template #actions>
        <v-btn icon="mdi-close" variant="text" @click="snackbar = false" />
      </template>
    </v-snackbar>
  </v-container>
</template>
