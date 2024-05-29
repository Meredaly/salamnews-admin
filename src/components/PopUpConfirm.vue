<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import SButton from '@/UI/SButton.vue'
  import PopUpBody from '@/components/PopUpBody.vue'

  const emit = defineEmits(['yes', 'no'])

  defineProps({
    title: { type: String, default: '' }
  })

  const { t } = useI18n()

  const no = () => {
    emit('no')
  }

  const yes = () => {
    emit('yes')
  }
</script>

<template>
  <pop-up-body @close="no" :title="title" width="350">
    <template #bot>
      <div class="_flex _flex-justify-end _gap-20">
        <s-button @click="no" :title="t('no')" styles="secondary" outline large block />
        <s-button @click="yes" :title="t('yes')" large block />
      </div>
    </template>
  </pop-up-body>
</template>

<style scoped lang="scss"></style>
