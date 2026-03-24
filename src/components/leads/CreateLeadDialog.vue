<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useLeadsStore } from '@/stores/useLeadsStore'
import type { LeadSource } from '@/types/lead'

const emit = defineEmits<{ close: [] }>()

const store = useLeadsStore()

const loading = ref(false)
const form = ref<InstanceType<typeof import('vuetify/components').VForm> | null>(null)

const sources: LeadSource[] = ['Facebook', 'Google', 'Referral', 'Organic', 'Other']

const fields = reactive({
  fullName: '',
  phone: '',
  email: '',
  source: null as LeadSource | null,
  owner: '',
  budget: '',
  tagsRaw: '',
})

const phoneRegex = /^\+?[\d\s\-().]{7,20}$/

const rules = {
  required: (v: string) => !!v || 'Required',
  phone: (v: string) => phoneRegex.test(v) || 'Invalid phone number',
  email: (v: string) => !v || /.+@.+\..+/.test(v) || 'Invalid email',
  budget: (v: string) => !v || (!isNaN(Number(v)) && Number(v) >= 0) || 'Must be a positive number',
}

async function submit() {
  const { valid } = await form.value!.validate()
  if (!valid) return

  loading.value = true
  await new Promise((r) => setTimeout(r, 500))

  store.addLead({
    fullName: fields.fullName,
    phone: fields.phone,
    email: fields.email || undefined,
    source: fields.source!,
    owner: fields.owner,
    budget: fields.budget ? Number(fields.budget) : undefined,
    tags: fields.tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    status: 'New',
  })

  loading.value = false

  fields.fullName = ''
  fields.phone = ''
  fields.email = ''
  fields.source = null
  fields.owner = ''
  fields.budget = ''
  fields.tagsRaw = ''
  form.value?.resetValidation()

  emit('close')
}
</script>

<template>
  <v-card min-width="480">
    <v-card-title>Create Lead</v-card-title>
    <v-divider />
    <v-form ref="form" @submit.prevent="submit">
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="fields.fullName"
              label="Full Name *"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="fields.phone"
              label="Phone *"
              :rules="[rules.required, rules.phone]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="fields.email"
              label="Email"
              :rules="[rules.email]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="fields.source"
              :items="sources"
              label="Source *"
              :rules="[rules.required]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-combobox
              v-model="fields.owner"
              :items="store.owners"
              label="Owner *"
              :rules="[rules.required]"
              variant="outlined"
              density="comfortable"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="fields.budget"
              label="Budget ($)"
              type="number"
              :rules="[rules.budget]"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="fields.tagsRaw"
              label="Tags (comma-separated)"
              hint="e.g. hot, enterprise"
              persistent-hint
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="emit('close')">Cancel</v-btn>
        <v-btn type="submit" color="primary" :loading="loading">Create</v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
