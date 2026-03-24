<script setup lang="ts">
import { computed } from 'vue'
import { useLeadsStore } from '@/stores/useLeadsStore'
import { useStatusConfig } from '@/composables/useStatusConfig'
import type { LeadStatus, LeadSource } from '@/types/lead'

const store = useLeadsStore()
const { allStatuses, getStatusLabel } = useStatusConfig()

const statusModel = computed({
  get: () => store.filters.status,
  set: (v: LeadStatus[]) => store.updateFilters({ status: v }),
})

const ownerModel = computed({
  get: () => store.filters.owner,
  set: (v: string) => store.updateFilters({ owner: v }),
})

const sourceModel = computed({
  get: () => store.filters.source,
  set: (v: LeadSource | '') => store.updateFilters({ source: v }),
})

const dateFromModel = computed({
  get: () => store.filters.dateFrom,
  set: (v: string) => store.updateFilters({ dateFrom: v }),
})

const dateToModel = computed({
  get: () => store.filters.dateTo,
  set: (v: string) => store.updateFilters({ dateTo: v }),
})

const sourceOptions = computed(() =>
  store.sources.map((s) => ({ title: s, value: s })),
)

const ownerOptions = computed(() =>
  store.owners.map((o) => ({ title: o, value: o })),
)

const statusOptions = allStatuses.map((s) => ({ title: getStatusLabel(s), value: s }))
</script>

<template>
  <v-card class="mb-4" elevation="1">
    <v-card-title class="text-subtitle-1 font-weight-medium">Filters</v-card-title>
    <v-card-text>
      <v-row dense>
        <v-col cols="12" md="4">
          <v-select
            v-model="statusModel"
            :items="statusOptions"
            label="Status"
            multiple
            chips
            closable-chips
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="ownerModel"
            :items="ownerOptions"
            label="Owner"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="sourceModel"
            :items="sourceOptions"
            label="Source"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="dateFromModel"
            label="Created from"
            type="date"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="dateToModel"
            label="Created to"
            type="date"
            clearable
            hide-details
          />
        </v-col>
        <v-col cols="12" md="auto" class="d-flex align-center">
          <v-btn variant="outlined" @click="store.resetFilters">Reset all</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
