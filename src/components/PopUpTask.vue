<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import SRow from '@/UI/SRow.vue'
  import SCol from '@/UI/SCol.vue'
  import STextField from '@/UI/STextField.vue'
  import SButton from '@/UI/SButton.vue'
  import PopUpBody from '@/components/PopUpBody.vue'

  const text = ref('')
  const emit = defineEmits(['close', 'save'])

  const { t } = useI18n()

  const close = () => {
    emit('close')
  }

  const save = () => {
    emit('save', text.value)
  }
</script>

<template>
  <pop-up-body @close="close" width="500">
    <s-row>
      <s-col cols="12">
        <s-text-field v-model.trim="text" :label="t('title')" />
      </s-col>
    </s-row>
    <template #bot>
      <div class="_flex _flex-justify-end _gap-20">
        <s-button @click="close" :title="t('cancel')" styles="secondary" outline large />
        <s-button @click="save" :title="t('save')" large />
      </div>
    </template>
  </pop-up-body>
</template>

<style scoped lang="scss"></style>
