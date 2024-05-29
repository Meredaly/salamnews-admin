<script setup lang="ts">
  import Icon from '@/UI/Icon'

  const emit = defineEmits(['close'])

  defineProps({
    title: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number],
      default: 300
    }
  })

  const close = () => {
    emit('close')
  }
</script>

<template>
  <div class="pop-up">
    <div class="pop-up__wrapper" :style="`--width: ${width}px`">
      <div class="pop-up__head">
        <div class="pop-up__title">{{ title }}</div>
        <button @click="close" class="pop-up__close">
          <icon name="clear" />
        </button>
      </div>
      <div class="pop-up__body">
        <slot></slot>
      </div>
      <div class="pop-up__bot">
        <slot name="bot"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .pop-up {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
    background-color: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10px);
    // .pop-up__wrapper
    &__wrapper {
      border-radius: var(--border-radius);
      background: var(--white);
      box-shadow: -2px 4px 20px 0px rgba(0, 0, 0, 0.25);
      max-width: 100%;
      width: var(--width);
      max-height: 100%;
      padding: 20px;
    }
    // .pop-up__head
    &__head {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
    }
    // .pop-up__title
    &__title {
      color: var(--dark);
      font-family: $secondFont;
      font-size: 20px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
    // .pop-up__close
    &__close {
      color: #323232;
      background-color: transparent;
      &:deep(.icon) {
        svg {
          width: 24px;
          height: 24px;
        }
      }
    }
    // .pop-up__body
    &__body {
      margin-top: 10px;
    }
    // .pop-up__bot
    &__bot {
      margin-top: 20px;
    }
  }
</style>
