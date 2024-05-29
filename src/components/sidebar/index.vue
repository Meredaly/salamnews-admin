<script setup lang="ts">
  import { PropType, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'

  import { useAuth } from '@/store/auth'
  import { MenuItem } from '@/types/base'

  defineProps({
    menu: {
      type: Array as PropType<MenuItem[]>,
      default: () => []
    }
  })

  const { t } = useI18n()

  const auth = useAuth()

  const jobTitle = computed(() => auth.user.job_title)
</script>

<template>
  <menu class="sidebar">
    <ul class="sidebar__list">
      <template v-for="menuItem in menu" :key="menuItem.id">
        <li v-if="menuItem.permissions.includes(jobTitle)" class="sidebar__item">
          <router-link :to="menuItem.link" class="sidebar__link">
            <div class="sidebar__icon">
              <icon :name="menuItem.icon" />
            </div>
            <p class="sidebar__text">{{ t(menuItem.title) }}</p>
          </router-link>
        </li>
      </template>
    </ul>
  </menu>
</template>

<style lang="scss" scoped>
  .sidebar {
    padding-top: 30px;
    // .sidebar__list
    &__list {
    }
    // .sidebar__item
    &__item {
      margin-bottom: 10px;
    }
    // .sidebar__link
    &__link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 10px 10px 9px;
      border-left: 1px solid transparent;
      &.router-link-active,
      &:hover {
        color: var(--accent);
        border-color: var(--accent);
        background-color: var(--accent-100);
      }
    }
    // .sidebar__icon
    &__icon {
      &:deep(svg) {
        width: 20px;
        height: 20px;
      }
    }
    // .sidebar__text
    &__text {
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }
  }
</style>
