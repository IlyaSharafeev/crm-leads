<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLeadsStore } from '@/stores/useLeadsStore'
import { useFormatters } from '@/composables/useFormatters'
import { useStatusConfig } from '@/composables/useStatusConfig'
import type { Lead } from '@/types/lead'

const emit = defineEmits<{
  'update:selected': [ids: string[]]
}>()

const props = defineProps<{
  selected: string[]
}>()

const store = useLeadsStore()
const router = useRouter()
const { formatDate, formatCurrency } = useFormatters()
const { getStatusColor, getStatusLabel } = useStatusConfig()

const headers = [
  { title: 'Name', key: 'fullName', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Owner', key: 'owner', sortable: true },
  { title: 'Source', key: 'source', sortable: true },
  { title: 'Last Activity', key: 'lastActivityAt', sortable: true },
  { title: 'Created', key: 'createdAt', sortable: true },
  { title: 'Budget', key: 'budget', sortable: true },
]

const selectedIds = computed({
  get: () => props.selected,
  set: (v: string[]) => emit('update:selected', v),
})

const itemsPerPageOptions = [
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 },
]

function onRowClick(_event: Event, row: { item: Lead }) {
  router.push(`/leads/${row.item.id}`)
}

function onSortUpdate(sortBy: { key: string; order: 'asc' | 'desc' }[]) {
  if (sortBy.length > 0) {
    store.sort.field = sortBy[0].key as keyof Lead
    store.sort.direction = sortBy[0].order
  }
}

const sortBy = computed(() => [{ key: store.sort.field, order: store.sort.direction }])

const serverItemsLength = computed(() => store.totalFiltered)

const currentItems = computed(() => store.paginatedLeads)
</script>

<template>
  <v-data-table
    v-model="selectedIds"
    :headers="headers"
    :items="currentItems"
    :items-per-page="store.pagination.perPage"
    :items-per-page-options="itemsPerPageOptions"
    :sort-by="sortBy"
    :server-items-length="serverItemsLength"
    item-value="id"
    show-select
    hover
    class="leads-table"
    @click:row="onRowClick"
    @update:sort-by="onSortUpdate"
    @update:items-per-page="(v: number) => { store.pagination.perPage = v; store.pagination.page = 1 }"
    @update:page="(v: number) => { store.pagination.page = v }"
  >
    <template #item.status="{ item }">
      <v-chip :color="getStatusColor(item.status)" size="small" label>
        {{ getStatusLabel(item.status) }}
      </v-chip>
    </template>

    <template #item.lastActivityAt="{ item }">
      {{ formatDate(item.lastActivityAt) }}
    </template>

    <template #item.createdAt="{ item }">
      {{ formatDate(item.createdAt) }}
    </template>

    <template #item.budget="{ item }">
      {{ formatCurrency(item.budget) }}
    </template>
  </v-data-table>
</template>

<style scoped>
.leads-table :deep(tbody tr) {
  cursor: pointer;
}
</style>
