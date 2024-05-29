<script setup lang="ts">
  import { PropType, computed } from 'vue'
  import Icon from '@/UI/Icon'
  import { useDropdown } from '@/composables/dropdown'

  import { ActionMenu } from '@/types/base'

  const emit = defineEmits(['selectItem', 'clear'])

  const props = defineProps({
    label: { type: String, default: '' },
    menu: {
      type: Array as PropType<ActionMenu[]>,
      default: () => []
    },
    selectedItem: { type: Object as PropType<any>, default: null },
    disabled: { type: Boolean, default: false },
    width: { type: String, default: null }
  })

  const { dropdownBody, dropdownMenu, showDropdown, showTop, closeDropdown, openDropdown } = useDropdown()

  const classes = computed(() => [
    'dropdown',
    {
      dropdown_disabled: props.disabled
    }
  ])

  const selectMenu = (menuItem: ActionMenu) => {
    emit('selectItem', menuItem)
    closeDropdown()
  }

  const clear = () => {
    emit('clear')
  }
</script>

<template>
  <div
    :class="classes"
    :style="{
      width: width
    }"
  >
    <div v-if="label" class="dropdown__label">{{ label }}</div>
    <div :class="['dropdown__body', { _active: showDropdown, _top: showTop }]" ref="dropdownBody">
      <div class="dropdown__button">
        <div @click="showDropdown ? closeDropdown() : openDropdown()" class="dropdown__text">
          {{ selectedItem?.title }}
        </div>
        <button v-if="selectedItem" @click="clear" class="dropdown__clear">
          <icon name="cancel" />
        </button>
        <div @click="showDropdown ? closeDropdown() : openDropdown()" class="dropdown__icon">
          <icon name="chevronDown" />
        </div>
      </div>
      <div class="dropdown__menu" ref="dropdownMenu">
        <button v-for="menuItem in menu" :key="menuItem.uuid" @click="selectMenu(menuItem)" class="dropdown__item">
          <icon v-if="menuItem.icon" :name="menuItem.icon" />
          <p>{{ menuItem.title }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .dropdown {
    // .dropdown__label
    &__label {
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: 16px;
      letter-spacing: 0.4px;
      padding-bottom: 4px;
    }
    // .dropdown__body
    &__body {
      position: relative;
      &._active {
        .dropdown__button {
          .dropdown__icon {
            &:deep() {
              .icon {
                transform: rotate(180deg);
              }
            }
          }
        }
        .dropdown__menu {
          height: auto;
        }
      }
    }

    // .dropdown__button
    &__button {
      border-radius: 4px;
      border: 1px solid #bdbdbd;
      position: relative;
      cursor: pointer;
      display: flex;
      color: var(--dark);
    }
    // .dropdown__text
    &__text {
      flex: 1 1;
      line-height: 20px;
      padding: 12px 8px 12px 15px;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      user-select: none;
    }
    // .dropdown__clear
    &__clear {
      background-color: transparent;
      &:hover {
        color: var(--accent);
      }
      &:deep() {
        .icon {
          svg {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    // .dropdown__icon
    &__icon {
      padding: 12px 15px 12px 8px;
      user-select: none;
      &:deep() {
        .icon {
          transition: 0.2s;
          svg {
            width: 24px;
            height: 24px;
          }
        }
      }
    }
    // .dropdown__menu
    &__menu {
      position: absolute;
      top: calc(100% + 2px);
      border-radius: 4px;
      background: var(--white);
      box-shadow: -2px 4px 21px 0px rgba(0, 0, 0, 0.1);
      width: 100%;
      height: 0;
      overflow: auto;
      max-height: 300px;
      z-index: 1;
    }
    // .dropdown__item
    &__item {
      display: block;
      background-color: transparent;
      padding: 12px 6px;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      width: 100%;
      text-align: left;
      &:hover,
      &._active {
        background: #f7f7f7;
      }
    }
  }
</style>
