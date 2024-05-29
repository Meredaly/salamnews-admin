<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { USER_STATUS } from '@/utils/constants'
  import { useAuth } from '@/store/auth'

  const { t } = useI18n()
  const auth = useAuth()

  const jobTitle = computed(() => auth.user.job_title)

  const menu = ref([
    { id: 2, link: '/news', title: 'news', permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER] },
    { id: 3, link: '/articles', title: 'articles', permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER] },
    { id: 4, link: '/media', title: 'media', permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER] },
    { id: 5, link: '/business', title: 'business', permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER] },
    { id: 6, link: '/poster', title: 'poster', permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER] },
    { id: 7, link: '/tenders', title: 'tenders', permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER] },
    { id: 8, link: '/watan', title: 'watanNews', permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER] },
    { id: 9, link: '/horoscope', title: 'horoscope', permissions: [USER_STATUS.REDACTOR, USER_STATUS.WRITER] },
    { id: 10, link: '/banners', title: 'banners', permissions: [USER_STATUS.REDACTOR] },
    { id: 11, link: '/employees', title: 'employees', permissions: [USER_STATUS.REDACTOR] }
  ])
</script>

<template>
  <menu class="navbar">
    <ul class="navbar__list">
      <template v-for="menuItem in menu" :key="menuItem.id">
        <li v-if="menuItem.permissions.includes(jobTitle)" class="navbar__item">
          <router-link :to="menuItem.link" class="navbar__link">{{ t(menuItem.title) }}</router-link>
        </li>
      </template>
    </ul>
  </menu>
</template>

<style lang="scss" scoped>
  .navbar {
    padding-top: 10px;
    // .navbar__list
    &__list {
      display: flex;
      gap: 30px;
    }
    // .navbar__item
    &__item {
    }
    // .navbar__link
    &__link {
      font-family: $secondFont;
      color: var(--dark);
      font-size: 14px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
      text-transform: uppercase;
      position: relative;
      display: block;
      padding: 6px 4px 10px 4px;
      transition: 0.2s;
      border-bottom: 1px solid transparent;
      margin-bottom: -1px;
      &.router-link-active,
      &:hover {
        color: var(--accent);
        border-bottom-color: var(--accent);
      }
    }
  }
</style>
