<script setup lang="ts">
import { useConfig } from "../main";

const cfg = useConfig();
</script>

<template>
  <div class="q-px-lg plugin-base">
    <h3>ListenBrainz Scrobbler Settings</h3>
    <div>
      ListenBrainz API Server:
      <input v-model="cfg.listenBrainzServer"></input>
    </div>
    <div>
      ListenBrainz Token:
      <input v-model="cfg.listenBrainzToken"></input>
    </div>
  </div>
</template>

<style scoped></style>
