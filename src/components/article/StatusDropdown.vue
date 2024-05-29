<script lang="ts" setup>
  import Icon from '@/UI/Icon'

  import { useDropdown } from '@/composables/dropdown'

  const emit = defineEmits(['publish', 'returnCorrection', 'plan', 'deleteArticle'])

  defineProps({
    removeArticle: {
      type: Boolean,
      default: false
    },
    removedTitle: {
      type: String,
      default: ''
    }
  })

  const { dropdownBody, dropdownMenu, showDropdown, closeDropdown, openDropdown } = useDropdown()

  const publish = () => {
    emit('publish')
    closeDropdown()
  }
  const returnCorrection = () => {
    emit('returnCorrection')
    closeDropdown()
  }
  const plan = () => {
    emit('plan')
    closeDropdown()
  }

  const deleteArticle = () => {
    emit('deleteArticle')
    closeDropdown()
  }
</script>

<template>
  <div ref="dropdownBody" class="status-dropdown">
    <div class="status-dropdown__button">
      <button @click="publish" class="status-dropdown__publish-button">
        <icon name="upload" />
        <p>Публиковать</p>
      </button>
      <button
        @click="showDropdown ? closeDropdown() : openDropdown()"
        :class="['status-dropdown__toggle-menu-button', { _active: showDropdown }]"
      >
        <icon name="chevronDown" />
      </button>
    </div>
    <div v-if="showDropdown" ref="dropdownMenu" class="status-dropdown__body">
      <button @click="returnCorrection" class="status-dropdown__item">Вернуть на исправление</button>
      <button @click="plan" class="status-dropdown__item">Планирование публикации</button>
      <button v-if="removeArticle" @click="deleteArticle" class="status-dropdown__item">{{ removedTitle }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .status-dropdown {
    position: relative;
    // .status-dropdown__button
    &__button {
      display: flex;
      align-items: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      border-radius: 4px;
      background: var(--accent);
      width: fit-content;
      color: var(--white);

      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    // .status-dropdown__publish-button
    &__publish-button {
      display: flex;
      align-items: center;
      background-color: transparent;
      color: inherit;
      gap: 10px;
      padding: 7px 10px 7px 10px;
    }
    // .status-dropdown__toggle-menu-button
    &__toggle-menu-button {
      padding: 7px;
      background-color: transparent;
      color: inherit;
      border-left: 1px solid var(--white);
      span {
        transition: 0.2s;
      }
      &._active {
        span {
          transform: rotate(180deg);
        }
      }
    }
    // .status-dropdown__body
    &__body {
      position: absolute;
      right: 0;
      top: calc(100% + 5px);
      width: max-content;
      border-radius: 4px;
      background: var(--white);
      box-shadow: -2px 4px 21px 0px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    // .status-dropdown__item
    &__item {
      display: block;
      width: 100%;
      color: var(--dark);
      text-align: left;
      background-color: transparent;
      padding: 7px 10px;
      line-height: 19px;
      &:hover {
        background: #f7f7f7;
      }
    }
  }
</style>
