<script setup lang="ts">
  import UserMenu from './UserMenu.vue'
  import Navbar from './Navbar.vue'
</script>

<template>
  <header class="header">
    <div class="header__top">
      <div class="header__container">
        <div class="header__top-wrapper">
          <div class="header__logo">
            <router-link to="/">
              <img src="@/assets/images/logo.svg" />
            </router-link>
          </div>
          <div class="header__user-menu">
            <user-menu />
          </div>
        </div>
      </div>
    </div>
    <div class="header__menu">
      <div class="header__container">
        <div class="header__menu-wrapper">
          <navbar />
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
  .header {
    background: var(--white);
    position: sticky;
    top: 0;
    z-index: 3;
    height: 118px;
    // .header__top
    &__top {
      border-bottom: 1px solid #e6e6e6;
      padding: 10px 0;
    }
    // .header__container
    &__container {
    }
    // .header__top-wrapper
    &__top-wrapper {
      display: flex;
      justify-content: space-between;
    }
    // .header__logo
    &__logo {
    }
    // .header__user-menu
    &__user-menu {
    }
    // .header__menu
    &__menu {
      border-top: 1px solid #dcdcdc;
      border-bottom: 1px solid #dcdcdc;
    }
    // .header__menu-wrapper
    &__menu-wrapper {
    }
  }
</style>
