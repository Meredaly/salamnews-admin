<script setup lang="ts">
  import { useRoute } from 'vue-router'
  const route = useRoute()
</script>

<template>
  <component :is="route.meta.layoutComponent as any">
    <slot />
  </component>
</template>

<style scoped></style>
