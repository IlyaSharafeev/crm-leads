export type LeadStatus = 'New' | 'InProgress' | 'Qualified' | 'Won' | 'Lost'

export type LeadSource = 'Facebook' | 'Google' | 'Referral' | 'Organic' | 'Other'

export interface LeadNote {
  id: string
  type: 'call' | 'email' | 'comment'
  text: string
  createdAt: string
  author: string
}

export interface Lead {
  id: string
  fullName: string
  phone: string
  email?: string
  status: LeadStatus
  source: LeadSource
  owner: string
  budget?: number
  tags: string[]
  createdAt: string
  lastActivityAt: string
}
