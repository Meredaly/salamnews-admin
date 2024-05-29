<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { useAutoHeight } from '@/composables/textareaAutoHeight'

  const { t } = useI18n()

  const { autoHeightRef, initAutoHeight } = useAutoHeight()

  const emit = defineEmits(['update:modelValue'])

  defineProps({
    modelValue: { type: [String, Number], default: '' }
  })

  const update = (newValue: string) => {
    emit('update:modelValue', newValue)
  }

  onMounted(() => {
    initAutoHeight()
  })
</script>

<template>
  <div class="article-note">
    <div class="article-note__title">{{ t('note') }}</div>
    <div class="article-note__text">
      <textarea
        ref="autoHeightRef"
        :value="modelValue"
        @input="(event: Event) => update((event.target as HTMLInputElement).value)"
        :placeholder="t('writeNoteHere')"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .article-note {
    width: 100%;
    // .article-note__title
    &__title {
      border-radius: 4px 4px 0px 0px;
      background: #ececec;
      padding: 5px 10px;
    }
    // .article-note__text
    &__text {
      padding: 10px;
      background: #f5f5f5;

      textarea {
        width: 100%;
        resize: none;
        border-radius: 0px 0px 4px 4px;
        background-color: transparent;
        color: #6b6b6b;
        font-size: 14px;
        height: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
      }
    }
  }
</style>
