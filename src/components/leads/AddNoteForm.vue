<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useLeadsStore } from '@/stores/useLeadsStore'
import type { LeadNote } from '@/types/lead'

const props = defineProps<{ leadId: string }>()

const store = useLeadsStore()

const form = ref<InstanceType<typeof import('vuetify/components').VForm> | null>(null)

const noteTypes: { title: string; value: LeadNote['type'] }[] = [
  { title: 'Call', value: 'call' },
  { title: 'Email', value: 'email' },
  { title: 'Comment', value: 'comment' },
]

const fields = reactive({
  type: 'comment' as LeadNote['type'],
  text: '',
})

const rules = {
  required: (v: string) => !!v || 'Required',
  minLen: (v: string) => v.length >= 3 || 'Minimum 3 characters',
}

async function submit() {
  const { valid } = await form.value!.validate()
  if (!valid) return

  store.addNote(props.leadId, {
    type: fields.type,
    text: fields.text,
    author: 'Current User',
  })

  fields.text = ''
  form.value?.resetValidation()
}
</script>

<template>
  <v-form ref="form" @submit.prevent="submit">
    <v-row dense>
      <v-col cols="12" md="3">
        <v-select
          v-model="fields.type"
          :items="noteTypes"
          label="Type"
          hide-details
        />
      </v-col>
      <v-col cols="12" md="7">
        <v-textarea
          v-model="fields.text"
          label="Note text"
          rows="2"
          auto-grow
          :rules="[rules.required, rules.minLen]"
        />
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-start pt-2">
        <v-btn type="submit" color="primary" block>Add</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>
