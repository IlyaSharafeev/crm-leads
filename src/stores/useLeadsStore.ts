import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Lead, LeadStatus, LeadSource, LeadNote } from '@/types/lead'
import leadsData from '@/data/leads.json'

interface Filters {
  status: LeadStatus[]
  owner: string
  source: LeadSource | ''
  dateFrom: string
  dateTo: string
}

interface SortState {
  field: keyof Lead
  direction: 'asc' | 'desc'
}

interface PaginationState {
  page: number
  perPage: number
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const randomDelay = () => delay(400 + Math.random() * 400)

export const useLeadsStore = defineStore('leads', () => {
  const leads = ref<Lead[]>([])
  const loading = ref(false)
  const filters = ref<Filters>({
    status: [],
    owner: '',
    source: '',
    dateFrom: '',
    dateTo: '',
  })
  const search = ref('')
  const sort = ref<SortState>({ field: 'lastActivityAt', direction: 'desc' })
  const pagination = ref<PaginationState>({ page: 1, perPage: 10 })
  const notesByLeadId = ref<Record<string, LeadNote[]>>({})

  const owners = computed(() => [...new Set(leads.value.map((l) => l.owner))].sort())
  const sources = computed(() => [...new Set(leads.value.map((l) => l.source))].sort())
  const statuses = computed(() => [...new Set(leads.value.map((l) => l.status))])

  const filteredLeads = computed(() => {
    let result = [...leads.value]

    if (search.value.trim()) {
      const q = search.value.toLowerCase()
      result = result.filter(
        (l) =>
          l.fullName.toLowerCase().includes(q) ||
          l.phone.toLowerCase().includes(q) ||
          (l.email ?? '').toLowerCase().includes(q),
      )
    }

    if (filters.value.status.length > 0) {
      result = result.filter((l) => filters.value.status.includes(l.status))
    }

    if (filters.value.owner) {
      result = result.filter((l) => l.owner === filters.value.owner)
    }

    if (filters.value.source) {
      result = result.filter((l) => l.source === filters.value.source)
    }

    if (filters.value.dateFrom) {
      result = result.filter(
        (l) => new Date(l.createdAt) >= new Date(filters.value.dateFrom),
      )
    }

    if (filters.value.dateTo) {
      result = result.filter(
        (l) => new Date(l.createdAt) <= new Date(filters.value.dateTo + 'T23:59:59Z'),
      )
    }

    result.sort((a, b) => {
      const field = sort.value.field
      const aVal = a[field] ?? ''
      const bVal = b[field] ?? ''
      const cmp = String(aVal).localeCompare(String(bVal))
      return sort.value.direction === 'asc' ? cmp : -cmp
    })

    return result
  })

  const totalFiltered = computed(() => filteredLeads.value.length)

  const paginatedLeads = computed(() => {
    const start = (pagination.value.page - 1) * pagination.value.perPage
    return filteredLeads.value.slice(start, start + pagination.value.perPage)
  })

  async function loadLeads() {
    loading.value = true
    await randomDelay()
    leads.value = leadsData as Lead[]
    loading.value = false
  }

  function updateLeadStatus(id: string, status: LeadStatus) {
    const lead = leads.value.find((l) => l.id === id)
    if (lead) {
      lead.status = status
      lead.lastActivityAt = new Date().toISOString()
    }
  }

  function bulkUpdateStatus(ids: string[], status: LeadStatus) {
    ids.forEach((id) => updateLeadStatus(id, status))
  }

  function addNote(leadId: string, note: Omit<LeadNote, 'id' | 'createdAt'>) {
    const now = new Date().toISOString()
    const newNote: LeadNote = {
      ...note,
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: now,
    }
    if (!notesByLeadId.value[leadId]) {
      notesByLeadId.value[leadId] = []
    }
    notesByLeadId.value[leadId].unshift(newNote)

    const lead = leads.value.find((l) => l.id === leadId)
    if (lead) lead.lastActivityAt = now
  }

  function updateFilters(newFilters: Partial<Filters>) {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1
  }

  function resetFilters() {
    filters.value = { status: [], owner: '', source: '', dateFrom: '', dateTo: '' }
    search.value = ''
    pagination.value.page = 1
  }

  function addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'lastActivityAt'>) {
    const now = new Date().toISOString()
    const newLead: Lead = {
      ...lead,
      id: `lead-${Date.now()}`,
      createdAt: now,
      lastActivityAt: now,
    }
    leads.value.unshift(newLead)
  }

  return {
    leads,
    loading,
    filters,
    search,
    sort,
    pagination,
    notesByLeadId,
    owners,
    sources,
    statuses,
    filteredLeads,
    paginatedLeads,
    totalFiltered,
    loadLeads,
    updateLeadStatus,
    bulkUpdateStatus,
    addNote,
    updateFilters,
    resetFilters,
    addLead,
  }
})
