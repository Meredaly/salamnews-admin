<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps({
    editorStatus: {
      type: String,
      default: 'SAVED'
    }
  })

  const { t } = useI18n()

  const EDITOR_STATUS_DATA = {
    SAVED: { class: '_saved', text: 'saved' },
    WRITING: { class: '_writing', text: 'editing' },
    SAVING: { class: '_saving', text: 'preservation' },
    ERROR: { class: '_error', text: 'error' }
  } as any

  const currentEditorStatus = computed(() => {
    return EDITOR_STATUS_DATA[props.editorStatus]
  })
</script>

<template>
  <div class="article__status-box">
    <div :class="['article__status', currentEditorStatus.class]">
      <div v-if="editorStatus === 'SAVING'" class="article__status-loader"></div>
      <div v-if="editorStatus === 'WRITING'" class="article__status-writing">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div v-if="editorStatus === 'SAVED'" class="article__status-saved">
        <span></span>
      </div>
      <div v-if="editorStatus === 'ERROR'" class="article__status-error"></div>
      <div class="article__status-text">{{ t(currentEditorStatus.text) }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .article {
    // .article__status
    &__status {
      padding: 0 10px;
      display: flex;
      align-items: center;
      gap: 10px;
      border: 1px solid var(--color);
      border-radius: 4px;
      height: 34px;
      &._error {
        --color: #df2f2f;
        background-color: rgba($color: #df2f2f, $alpha: 0.3);
      }
      &._saving {
        --color: #2fdfa4;
        background-color: rgba($color: #2fdfa4, $alpha: 0.1);
      }
      &._writing {
        --color: #2fdfce;
        background-color: rgba($color: #2fdfce, $alpha: 0.1);
      }
      &._saved {
        --color: #1c934a;
        background-color: rgba($color: #1c934a, $alpha: 0.1);
      }
    }
    // .article__status-loader
    &__status-loader {
      width: 16px;
      height: 16px;
      border: 2px solid var(--color);
      border-radius: 50%;
      border-left-color: transparent;
      animation: 0.5s rotate linear infinite;
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }
    // .article__status-writing
    &__status-writing {
      display: flex;
      gap: 2px;
      height: 20px;
      width: 20px;
      position: relative;
      span {
        display: block;
        width: 4px;
        height: 4px;
        background-color: var(--color);
        position: relative;
        border-radius: 2px;
        top: 8px;
        animation: 0.8s bullet-animation linear infinite;
        &:nth-child(1) {
        }
        &:nth-child(2) {
          animation-delay: 0.2s;
        }
        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
      @keyframes bullet-animation {
        0% {
          transform: translateY(0);
        }
        25% {
          transform: translateY(-5px);
        }
        50% {
          transform: translateY(0);
        }
        75% {
          transform: translateY(5px);
        }
        100% {
          transform: translateY(0);
        }
      }
    }
    // .article__status-saved
    &__status-saved {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: var(--color);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      span {
        display: block;
        width: 5px;
        height: 10px;
        border-right: 2px solid var(--white);
        border-bottom: 2px solid var(--white);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -60%) rotate(45deg);
      }
    }
    // .articles__status-error
    &__status-error {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: var(--color);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      &::before,
      &::after {
        content: '';
        position: absolute;
        width: 10px;
        height: 2px;
        border-radius: 1px;
        background-color: var(--white);
        top: 50%;
        left: 50%;
      }
      &::before {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
      &::after {
        transform: translate(-50%, -50%) rotate(45deg);
      }
    }
    // .article__status-text
    &__status-text {
      font-weight: 600;
      line-height: 20px;
      color: var(--color);
    }
  }
</style>
