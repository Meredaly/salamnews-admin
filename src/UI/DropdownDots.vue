<script setup lang="ts">
  import { PropType } from 'vue'
  import Icon from '@/UI/Icon'
  import { useDropdown } from '@/composables/dropdown'

  import { ActionMenu } from '@/types/base'

  const emit = defineEmits(['selectItem'])

  defineProps({
    menu: {
      type: Array as PropType<ActionMenu[]>,
      default: () => []
    }
  })

  const { dropdownBody, dropdownMenu, showDropdown, showTop, closeDropdown, openDropdown } = useDropdown()

  const selectMenu = (menuItem: ActionMenu) => {
    emit('selectItem', menuItem)
    closeDropdown()
  }
</script>

<template>
  <div :class="['dropdown-dots', { _active: showDropdown, _top: showTop }]" ref="dropdownBody">
    <button @click="showDropdown ? closeDropdown() : openDropdown()" class="dropdown-dots__button">
      <icon name="more" />
    </button>
    <div ref="dropdownMenu" class="dropdown-dots__menu">
      <button v-for="menuItem in menu" :key="menuItem.uuid" @click="selectMenu(menuItem)" class="dropdown-dots__item">
        <icon v-if="menuItem.icon" :name="menuItem.icon" />
        <p>{{ menuItem.title }}</p>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .dropdown-dots {
    position: relative;
    width: fit-content;
    &._active {
      .dropdown-dots__button {
        background: #ededed;
      }
      .dropdown-dots__menu {
        height: auto;
      }
    }
    &._top {
      .dropdown-dots__menu {
        top: auto;
        bottom: calc(100% + 5px);
      }
    }
    // .dropdown-dots__button
    &__button {
      padding: 10px;
      border-radius: 50%;
      background-color: transparent;
    }
    // .dropdown-dots__menu
    &__menu {
      position: absolute;
      right: 0;
      top: calc(100% + 5px);
      border-radius: var(--border-radius);
      box-shadow: 3px 4px 13px 0px rgba(0, 0, 0, 0.1);
      width: 163px;
      z-index: 1;
      background-color: var(--white);
      height: 0;
      overflow: hidden;
      max-height: 300px;
    }
    // .dropdown-dots__item
    &__item {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      background-color: transparent;
      padding: 10px;
      color: var(--dark);
      &:hover {
        background-color: var(--accent-100);
        color: var(--accent);
      }
      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
      p {
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
      }
    }
  }
</style>
