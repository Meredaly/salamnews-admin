<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import SButton from '@/UI/SButton.vue'
  import Icon from '@/UI/Icon'

  import { useDropdown } from '@/composables/dropdown'

  const { t } = useI18n()

  const emit = defineEmits(['pin'])

  const { dropdownBody, dropdownMenu, showDropdown, closeDropdown, openDropdown } = useDropdown()

  const pin = (position: number) => {
    emit('pin', position)
    closeDropdown()
  }
</script>

<template>
  <div ref="dropdownBody" class="pin-dropdown">
    <div class="pin-dropdown__button">
      <s-button
        @click="showDropdown ? closeDropdown() : openDropdown()"
        :title="t('pushPin')"
        prev-icon="pushPin"
        append-icon="chevronDown"
        styles="secondary"
      />
    </div>
    <div v-if="showDropdown" ref="dropdownMenu" class="pin-dropdown__menu">
      <button @click="pin(1)" class="pin-dropdown__item">
        <p>{{ t('position') }} 1</p>
        <div class="pin-dropdown__item-hover-item">
          <icon name="pin1" />
        </div>
      </button>
      <button @click="pin(2)" class="pin-dropdown__item">
        <p>{{ t('position') }} 2</p>
        <div class="pin-dropdown__item-hover-item">
          <icon name="pin2" />
        </div>
      </button>
      <button @click="pin(3)" class="pin-dropdown__item">
        <p>{{ t('position') }} 3</p>
        <div class="pin-dropdown__item-hover-item">
          <icon name="pin3" />
        </div>
      </button>
      <button @click="pin(4)" class="pin-dropdown__item">
        <p>{{ t('ticker') }}</p>
        <div class="pin-dropdown__item-hover-item">
          <icon name="pin3" />
        </div>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .pin-dropdown {
    position: relative;
    // .pin-dropdown__button
    &__button {
    }
    // .pin-dropdown__menu
    &__menu {
      position: absolute;
      right: 0;
      top: calc(100% + 5px);
      width: max-content;
      border-radius: 4px;
      background: var(--white);
      box-shadow: -2px 4px 21px 0px rgba(0, 0, 0, 0.1);
      width: 100%;
    }
    // .pin-dropdown__item
    &__item {
      display: block;
      width: 100%;
      color: var(--dark);
      text-align: left;
      background-color: transparent;
      padding: 7px 10px;
      line-height: 19px;
      position: relative;
      &:hover {
        background: #f7f7f7;
        .pin-dropdown__item-hover-item {
          display: block;
        }
      }
    }
    // .pin-dropdown__item-hover-item
    &__item-hover-item {
      position: absolute;
      display: none;
      user-select: none;
      pointer-events: none;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
    }
  }
</style>
