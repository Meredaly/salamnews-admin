<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useCookies } from 'vue3-cookies'
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'

  import { useAuth } from '@/store/auth'
  import { useDropdown } from '@/composables/dropdown'
  import { useBase } from '@/store/base'

  import { Lang } from './userMenu.types'

  const { dropdownBody, dropdownMenu, showDropdown, closeDropdown, openDropdown } = useDropdown()

  const { cookies } = useCookies()
  const router = useRouter()
  const { t, locale } = useI18n()
  const auth = useAuth()
  const base = useBase()

  const selectedLanguage = ref<Lang | null>(null)
  const languages = ref<Lang[]>([
    { uuid: 'tm', name: 'Türkmen' },
    { uuid: 'ru', name: 'Русский' }
  ])

  const selectLanguage = (lang: Lang) => {
    selectedLanguage.value = lang
    locale.value = lang.uuid
    cookies.set('lang', lang.uuid, 100000000)

    closeDropdown()
  }

  const signOut = () => {
    auth.logOut()
    router.push('/authorization/login')
  }

  if (cookies.get('lang')) {
    let lang = languages.value.find((lang) => lang.uuid === cookies.get('lang')) || null
    if (lang) selectLanguage(lang)
  } else {
    selectedLanguage.value = languages.value.find((lang) => lang.uuid === locale.value) || null
  }

  const roleNames = {
    REDACTOR: 'Редактор',
    WRITER: 'Писатель',
    MODERATOR: 'Модератор'
  } as any

  const roleName = computed(() => {
    return roleNames[auth.user.job_title]
  })
</script>

<template>
  <div class="user-menu" ref="dropdownBody">
    <button @click="showDropdown ? closeDropdown() : openDropdown()" class="user-menu__info">
      <div class="user-menu__avatar">
        <img v-if="auth.user.path" :src="base.baseURL + auth.user.path" :alt="auth.user.name" />
        <span v-else>{{ auth.user.name[0]?.toUpperCase() }}{{ auth.user.surname[0]?.toUpperCase() }}</span>
      </div>
      <div class="user-menu__info-content">
        <div class="user-menu__name">{{ auth.user.name }} {{ auth.user.surname }}</div>
        <div class="user-menu__role">{{ roleName }}</div>
      </div>
      <div class="user-menu__info-arrow">
        <icon name="chevronDown" />
      </div>
    </button>
    <div v-show="showDropdown" ref="dropdownMenu" class="user-menu__menu">
      <div class="user-menu__menu-info">
        <div class="user-menu__avatar">
          <span>{{ auth.user.name[0].toUpperCase() }}{{ auth.user.surname[0]?.toUpperCase() }}</span>
        </div>
        <div class="user-menu__menu-content">
          <div class="user-menu__name">{{ auth.user.name }} {{ auth.user.surname }}</div>
          <div class="user-menu__role">{{ roleName }}</div>
        </div>
      </div>
      <div class="user-menu__language">
        <div class="menu-language">
          <button class="menu-language__button">
            <icon name="globe" />
            <p>{{ t('selectLanguage') }}</p>
            <div class="menu-language__button-arrow">
              <icon name="chevronRight" />
            </div>
          </button>
          <div class="menu-language__menu">
            <div class="menu-language__items">
              <template v-for="language in languages" :key="language.uuid">
                <button @click="selectLanguage(language)" class="menu-language__item">{{ language.name }}</button>
              </template>
            </div>
          </div>
        </div>
      </div>
      <button @click="signOut" class="user-menu__logout">
        <icon name="signOut" />
        <p>{{ t('logOut') }}</p>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .user-menu {
    position: relative;
    // .user-menu__info
    &__info {
      display: flex;
      align-items: center;
      gap: 10px;
      border-radius: 4px;
      background: var(--gray-1);
      padding: 5px 10px;
    }
    // .user-menu__avatar
    &__avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      background-color: var(--gray-5);
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
      span {
      }
    }
    // .user-menu__info-content
    &__info-content {
      text-align: left;
    }
    // .user-menu__name
    &__name {
      color: var(--black);
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      letter-spacing: 0.25px;
    }
    // .user-menu__role
    &__role {
      color: var(--black);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      letter-spacing: 0.25px;
      margin-top: 4px;
    }
    // .user-menu__info-arrow
    &__info-arrow {
    }
    // .user-menu__menu
    &__menu {
      top: calc(100% + 5px);
      right: 0;
      min-width: 204px;
      width: 100%;
      position: absolute;
      border-radius: 4px;
      background: #fff;
      box-shadow: -2px 4px 20px 0px rgba(0, 0, 0, 0.1);
      padding: 20px 10px;
      gap: 10px;
    }
    // .user-menu__menu-info
    &__menu-info {
      display: flex;
      flex-direction: column;
      text-align: center;
      align-items: center;
    }
    // .user-menu__menu-content
    &__menu-content {
      margin-top: 9px;
    }
    // .user-menu__language
    &__language {
      width: 100%;
    }
    // .user-menu__logout
    &__logout {
      margin-top: 6px;
      border-radius: 4px;
      background: var(--accent-100);
      color: var(--accent);
      width: 100%;
      display: flex;
      align-items: center;
      padding: 4px;
      gap: 6px;
      &:deep() {
        .icon {
          svg {
            width: 18px;
            height: 18px;
          }
        }
      }
      p {
        text-align: left;
        color: #df2f2f;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
    }
  }
  .menu-language {
    width: 100%;
    position: relative;
    &:hover {
      .menu-language__menu {
        display: block;
      }
    }
    // .menu-language__button
    &__button {
      margin-top: 6px;
      border-radius: 4px;
      color: var(--dark);
      background-color: transparent;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 4px;
      gap: 10px;
      &:hover {
        background-color: var(--gray-1);
      }
      p {
        flex: 1 1;
        text-align: left;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
      &:deep() {
        .icon {
          svg {
            width: 18px;
            height: 18px;
          }
        }
      }
    }
    // .menu-language__button-arrow
    &__button-arrow {
    }
    // .menu-language__menu
    &__menu {
      position: absolute;
      left: 100%;
      top: 0;
      padding-left: 22px;
      display: none;
    }
    // .menu-language__items
    &__items {
      min-width: 120px;
      border-radius: 4px;
      background: var(--white);
      box-shadow: -2px 4px 21px 0px rgba(0, 0, 0, 0.1);
      padding: 5px 0;
    }
    // .menu-language__item
    &__item {
      display: block;
      width: 100%;
      text-align: left;
      color: var(--dark);
      padding: 4px 6px;
      background-color: transparent;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      // .menu-language__item_active
      &_active,
      &:hover {
        background: var(--gray-1);
      }
    }
  }
</style>
