import { watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLeadsStore } from '@/stores/useLeadsStore'
import type { LeadStatus, LeadSource } from '@/types/lead'

export function useQuerySync() {
  const router = useRouter()
  const route = useRoute()
  const store = useLeadsStore()

  function restoreFromQuery() {
    const q = route.query

    if (q.search) store.search = String(q.search)

    if (q.status) {
      const statuses = (Array.isArray(q.status) ? q.status : [q.status]) as LeadStatus[]
      store.updateFilters({ status: statuses })
    }

    if (q.owner) store.updateFilters({ owner: String(q.owner) })

    if (q.source) store.updateFilters({ source: String(q.source) as LeadSource })

    if (q.dateFrom) store.updateFilters({ dateFrom: String(q.dateFrom) })

    if (q.dateTo) store.updateFilters({ dateTo: String(q.dateTo) })

    if (q.page) store.pagination.page = Number(q.page)

    if (q.perPage) store.pagination.perPage = Number(q.perPage)

    if (q.sortField) {
      store.sort.field = String(q.sortField) as typeof store.sort.field
    }

    if (q.sortDir) {
      store.sort.direction = String(q.sortDir) as 'asc' | 'desc'
    }
  }

  function buildQuery() {
    const q: Record<string, string | string[]> = {}

    if (store.search) q.search = store.search
    if (store.filters.status.length) q.status = store.filters.status
    if (store.filters.owner) q.owner = store.filters.owner
    if (store.filters.source) q.source = store.filters.source
    if (store.filters.dateFrom) q.dateFrom = store.filters.dateFrom
    if (store.filters.dateTo) q.dateTo = store.filters.dateTo
    if (store.pagination.page !== 1) q.page = String(store.pagination.page)
    if (store.pagination.perPage !== 10) q.perPage = String(store.pagination.perPage)
    if (store.sort.field !== 'lastActivityAt') q.sortField = store.sort.field
    if (store.sort.direction !== 'desc') q.sortDir = store.sort.direction

    return q
  }

  onMounted(() => {
    restoreFromQuery()
  })

  watch(
    [
      () => store.search,
      () => store.filters,
      () => store.pagination.page,
      () => store.pagination.perPage,
      () => store.sort.field,
      () => store.sort.direction,
    ],
    () => {
      router.replace({ query: buildQuery() })
    },
    { deep: true },
  )
}
