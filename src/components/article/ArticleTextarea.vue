<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useAutoHeight } from '@/composables/textareaAutoHeight'

  const emit = defineEmits(['update:modelValue', 'update'])

  const props = defineProps({
    placeholder: { type: String, default: '' },
    size: { type: String, default: 'NORMAL' },
    textEnd: { type: Boolean, default: false },
    modelValue: { type: [String, Number], default: '' },
    value: { type: [String, Number], default: '' }
  })

  const { autoHeightRef, initAutoHeight } = useAutoHeight()

  const sizeClass = () => {
    const sizes = {
      BIG: 'article-textarea_big',
      LARGE: 'article-textarea_large',
      NORMAL: 'article-textarea_normal',
      '': ''
    } as any
    return sizes[props.size]
  }

  const update = (newValue: string) => {
    emit('update:modelValue', newValue)
    emit('update', newValue)
  }

  onMounted(() => {
    initAutoHeight()
  })
</script>

<template>
  <div
    :class="[
      'article-textarea',
      sizeClass(),
      {
        'article-textarea_text-end': textEnd
      }
    ]"
  >
    <textarea
      ref="autoHeightRef"
      :value="modelValue || value"
      @input="(event: Event) => update((event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
    ></textarea>
  </div>
</template>

<style scoped lang="scss">
  .article-textarea {
    width: 100%;
    padding: 6px 10px;
    cursor: text;
    background: #f5f5f5;
    color: var(--text);
    // .article-textarea_text-end
    &_text-end {
      textarea {
        text-align: end;
      }
    }
    textarea {
      width: 100%;
      resize: none;
      border-radius: 5px;
      background-color: transparent;
      font-family: $secondFont;
      font-size: 14px;
      line-height: 19px;
      font-style: normal;
      font-weight: 700;
      height: 19px;
      &::placeholder {
        color: #d0d0d0;
      }
    }

    // .article-textarea_big
    &_big {
      padding: 10px 15px;
      textarea {
        font-size: 34px;
        line-height: 43px;
        height: 44px;
      }
    }

    // .article-textarea_large
    &_large {
      padding: 8.5px 15px;
      textarea {
        font-size: 18px;
        line-height: 23px;
        height: 24px;
      }
    }
  }
</style>
