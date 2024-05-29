<script setup lang="ts">
  import { computed } from 'vue'
  import Icon from '@/UI/Icon'

  const props = defineProps({
    title: { type: String, default: null },
    prevIcon: { type: String, default: null },
    appendIcon: { type: String, default: null },
    styles: { type: String, default: 'primary' },
    disabled: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  })

  const classes = computed(() => [
    'button',
    `button_${props.styles}`,
    {
      'button_only-icon': !props.title,
      button_block: props.block,
      button_large: props.large,
      button_outline: props.outline,
      button_disabled: props.disabled,
      button_loading: props.loading
    }
  ])
</script>

<template>
  <button :class="classes" :disabled="props.disabled">
    <span v-if="props.prevIcon" class="button__icon-prev">
      <icon :name="props.prevIcon" />
    </span>
    <span v-if="props.title" class="button__content">
      {{ props.title }}
    </span>
    <span v-if="props.appendIcon" class="button__icon-append">
      <icon :name="props.appendIcon" />
    </span>
  </button>
</template>

<style lang="scss" scoped>
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: var(--border-radius);
    padding: 8px 9px;
    border: 1px solid transparent;
    color: var(--dark);
    background-color: transparent;
    // .button_only-icon
    &_only-icon {
      padding: 8px;
    }
    // .button__content
    &__content {
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 20px;
    }

    // .button__icon-prev
    &__icon-prev {
      &:deep(svg) {
        width: 20px;
        height: 20px;
      }
    }
    // .button__icon-append
    &__icon-append {
      &:deep(svg) {
        width: 20px;
        height: 20px;
      }
    }
    // .button_primary
    &_primary {
      background-color: var(--accent);
      border-color: var(--accent);
      color: var(--white);
    }
    // .button_large
    &_large {
      padding: 9px 17px;
      .button__content {
        font-size: 16px;
        line-height: 24px;
        font-weight: 500;
      }
    }
    // .button_loading
    &_loading {
      position: relative;
      .button__content {
        user-select: none;
        opacity: 0;
      }
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        width: 20px;
        height: 20px;
        border: 2px solid var(--white);
        z-index: 1;
        border-left-color: transparent;
        animation: 1s infinity-rotate linear infinite;
      }
      @keyframes infinity-rotate {
        to {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        from {
          transform: translate(-50%, -50%) rotate(-360deg);
        }
      }
    }
    // .button_block
    &_block {
      width: 100%;
    }
    // .button_secondary
    &_secondary {
      background-color: var(--dark);
      border-color: var(--dark);
      color: var(--white);
      &.button_outline {
        background-color: transparent;
        .button__content {
          color: var(--dark);
        }
      }
      &:hover {
        background-color: var(--dark);
        .button__content {
          color: var(--white);
        }
      }
    }

    // .button_light
    &_light {
      background-color: #f5f5f5;
      border-color: #f5f5f5;
      color: #333;
    }
  }
</style>
