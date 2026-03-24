<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useLeadsStore } from '@/stores/useLeadsStore'
import { useQuerySync } from '@/composables/useQuerySync'
import LeadsFilters from '@/components/leads/LeadsFilters.vue'
import LeadsTable from '@/components/leads/LeadsTable.vue'
import BulkActionBar from '@/components/leads/BulkActionBar.vue'
import CreateLeadDialog from '@/components/leads/CreateLeadDialog.vue'

const store = useLeadsStore()
useQuerySync()

const filtersOpen = ref(true)
const selectedIds = ref<string[]>([])
const searchInput = ref(store.search)
const createDialog = ref(false)

let debounceTimer: ReturnType<typeof setTimeout>
watch(searchInput, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    store.search = val
  }, 300)
})

watch(() => store.search, (val) => {
  if (val !== searchInput.value) searchInput.value = val
})

onMounted(() => {
  if (store.leads.length === 0) store.loadLeads()
})
</script>

<template>
  <v-container fluid class="py-6">
    <div class="d-flex align-center mb-4 gap-3">
      <h1 class="text-h5 font-weight-bold">Leads</h1>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="createDialog = true">
        New Lead
      </v-btn>
    </div>

    <div class="d-flex align-center gap-2 mb-3">
      <v-text-field
        v-model="searchInput"
        prepend-inner-icon="mdi-magnify"
        label="Search by name, phone, email…"
        clearable
        hide-details
        style="max-width: 420px"
        @click:clear="store.search = ''"
      />
      <v-btn
        :prepend-icon="filtersOpen ? 'mdi-filter-off' : 'mdi-filter'"
        variant="tonal"
        @click="filtersOpen = !filtersOpen"
      >
        {{ filtersOpen ? 'Hide Filters' : 'Show Filters' }}
      </v-btn>
    </div>

    <v-expand-transition>
      <div v-show="filtersOpen">
        <LeadsFilters />
      </div>
    </v-expand-transition>

    <BulkActionBar :selected-ids="selectedIds" @clear="selectedIds = []" />

    <v-card elevation="1">
      <v-overlay
        :model-value="store.loading"
        contained
        class="align-center justify-center"
      >
        <v-progress-circular indeterminate color="primary" size="56" />
      </v-overlay>

      <LeadsTable
        v-model:selected="selectedIds"
      />
    </v-card>

    <v-dialog v-model="createDialog" max-width="600" @after-leave="selectedIds = []">
      <CreateLeadDialog @close="createDialog = false" />
    </v-dialog>
  </v-container>
</template>
