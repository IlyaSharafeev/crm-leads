import type { LeadStatus } from '@/types/lead'

interface StatusConfig {
  color: string
  label: string
}

const STATUS_CONFIG: Record<LeadStatus, StatusConfig> = {
  New: { color: 'blue', label: 'New' },
  InProgress: { color: 'orange', label: 'In Progress' },
  Qualified: { color: 'purple', label: 'Qualified' },
  Won: { color: 'green', label: 'Won' },
  Lost: { color: 'red', label: 'Lost' },
}

export function useStatusConfig() {
  function getStatusColor(status: LeadStatus): string {
    return STATUS_CONFIG[status]?.color ?? 'grey'
  }

  function getStatusLabel(status: LeadStatus): string {
    return STATUS_CONFIG[status]?.label ?? status
  }

  const allStatuses: LeadStatus[] = ['New', 'InProgress', 'Qualified', 'Won', 'Lost']

  return { getStatusColor, getStatusLabel, allStatuses, STATUS_CONFIG }
}
