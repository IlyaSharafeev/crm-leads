<script setup lang="ts">
</script>

<template>
  <v-app>
    <v-app-bar elevation="1" color="white">
      <v-app-bar-title>
        <span class="font-weight-bold text-primary">CRM</span>
        <span class="text-medium-emphasis ml-1">Leads</span>
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
