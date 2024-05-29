<script setup lang="ts">
  import { computed } from 'vue'
  import Icon from '@/UI/Icon'

  const emit = defineEmits([
    'click:prevent',
    'click:append',
    'update:modelValue',
    'click:input',
    'value',
    'updateValue'
  ])

  const props = defineProps({
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    type: { type: String, default: 'text' },
    modelValue: { type: [String, Number], default: null },
    value: { type: [String, Number], default: null },
    prevIcon: { type: String, default: null },
    appendIcon: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    width: { type: String, default: null },
    small: { type: Boolean, default: false },
    isPrevClickable: { type: Boolean, default: false },
    isAppendClickable: { type: Boolean, default: false }
  })

  const update = (newValue: number | string) => {
    if (props.type === 'number') newValue = Number(newValue)

    emit('update:modelValue', newValue)
    emit('value', newValue)
    emit('updateValue', newValue)
  }

  const clickAppend = () => {
    emit('click:append')
  }

  const classes = computed(() => [
    'text-field',
    {
      'text-field_small': props.small,
      'text-field_error': props.error
    }
  ])
</script>

<template>
  <div :class="classes" :style="{ width: width }">
    <div v-if="label" class="text-field__label">{{ label }}</div>
    <div class="text-field__body">
      <div v-if="prevIcon" class="text-field__prev-icon">
        <icon :name="prevIcon" />
      </div>
      <div class="text-field__input">
        <input
          :type="type"
          :placeholder="placeholder"
          :value="modelValue || value"
          :disabled="disabled"
          @input="(event: Event) => update((event.target as HTMLInputElement).value)"
        />
      </div>
      <div
        v-if="appendIcon"
        @click="clickAppend"
        :class="['text-field__append-icon', { _clickable: isAppendClickable }]"
      >
        <icon :name="appendIcon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .text-field {
    // .text-field__label
    &__label {
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0.4px;
      padding-bottom: 4px;
    }
    // .text-field__body
    &__body {
      border-radius: 4px;
      border: 1px solid #bdbdbd;
      position: relative;
      &:has(.text-field__append-icon) {
        .text-field__input input {
          padding-right: 38px;
        }
      }
    }

    .text-field__prev-icon + .text-field__input input {
      padding-left: 38px;
    }
    // .text-field__prev-icon
    &__prev-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
    }
    // .text-field__input
    &__input {
      width: 100%;
      input {
        width: 100%;
        padding: 14px 15px;
        background-color: transparent;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: 20px;
        color: var(--dark);
        &::placeholder {
          color: #828282;
        }
        &[type='number'] {
          -moz-appearance: textfield;
        }
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      }
    }
    // .text-field__append-icon
    &__append-icon {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      &:deep(.icon) {
        svg {
          width: 24px;
          height: 24px;
        }
      }
      &._clickable {
        cursor: pointer;
        pointer-events: all;
        user-select: none;
      }
    }
    // .text-filed_small
    &_small {
      .text-field__body {
        border-color: #f7f7f7;
        background: #f7f7f7;
      }
      .text-field__prev-icon {
        left: 10px;
        &:deep(.icon) {
          svg {
            width: 20px;
            height: 20px;
          }
        }
      }
      .text-field__append-icon {
        right: 10px;
        &:deep(.icon) {
          svg {
            width: 20px;
            height: 20px;
          }
        }
      }
      .text-field__input {
        input {
          padding: 8px 9px;
          font-size: 14px;
          font-weight: 500;
          line-height: 20px;
          &::placeholder {
            color: #bdbdbd;
          }
        }
      }
    }
    // .text-field_error
    &_error {
      .text-field__body {
        border-color: var(--accent);
        background: var(--accent-100);
      }
    }
  }
</style>
