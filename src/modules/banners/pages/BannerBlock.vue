<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import SButton from '@/UI/SButton.vue'
  import Pagination from '@/components/Pagination.vue'
  import TabHead from '../components/TabHead.vue'
  import MainBox from '../components/MainBox.vue'
  import BannerItem from '../components/BannerItem.vue'

  import { TabRoutes, Banner } from '../types'

  import { ADD_BANNER, GET_BANNERS } from '../api'

  const router = useRouter()
  const route = useRoute()

  const { t } = useI18n()

  const tabRoutes: TabRoutes = {
    bannerVIP: '/banners/banner?banner=bannerVIP',
    bannerA: '/banners/banner?banner=bannerA',
    bannerB: '/banners/banner?banner=bannerB',
    bannerC: '/banners/banner?banner=bannerC',
    bannerD: '/banners/banner?banner=bannerD',
    bannerE: '/banners/banner?banner=bannerE',
    bannerF: '/banners/banner?banner=bannerF',
    advertising: '/banners/banner?banner=advertising'
  }

  const count = ref(0)
  const page = ref(1)
  const pages = ref(1)
  const limit = ref(20)

  const banners = ref<Banner[]>([])

  const getBanners = async () => {
    try {
      const { data } = await GET_BANNERS({
        params: {
          limit: limit.value,
          t: bannerType.value,
          page: page.value - 1
        }
      })

      count.value = data.count || 0
      pages.value = Math.ceil(data.count / limit.value)
      banners.value = data.get_banner
    } catch (error) {
      console.error(error)
    }
  }

  const bannerType = computed(() => route.query.banner || 'bannerVIP')

  const addBanner = async () => {
    try {
      const { data } = await ADD_BANNER({
        data: {
          type: bannerType.value
        }
      })
      router.push(`/banners/edit/${data}`)
    } catch (error) {
      console.error(error)
    }
  }

  const openBanner = (banner: any): void => {
    router.push(`/banners/edit/${banner.uuid}`)
  }

  const updatePage = (newPage: number) => {
    page.value = newPage
    goToPath()
  }

  const goToPath = () => {
    router.push({
      path: `/banners/banner`,
      query: { page: page.value, banner: bannerType.value }
    })
    getBanners()
  }

  onMounted(async () => {
    page.value = Number(route.query.page) || 1
    await getBanners()
  })
  const selectTab = () => {
    banners.value = []
    page.value = 1
    count.value = 0
    setTimeout(() => {
      goToPath()
    }, 100)
  }
</script>

<template>
  <main-box>
    <div class="banner">
      <div class="banner__head">
        <tab-head @select-tab="selectTab" :tab-routes="tabRoutes" :title="t('banners')">
          <s-button @click="addBanner" prev-icon="addCircle" :title="t('addBanner')" />
        </tab-head>
      </div>
      <div class="banner__wrapper">
        <div class="banner__body">
          <banner-item v-for="banner in banners" :banner="banner" @click="openBanner(banner)" />
        </div>
      </div>
      <div class="banner__pagination">
        <pagination @click-page="updatePage" :page="page" :pages="pages" :limit="limit" :count="count" />
      </div>
    </div>
  </main-box>
</template>

<style lang="scss" scoped>
  .banner {
    margin-bottom: 20px;
    // .banner__head
    &__head {
    }
    // .banner__wrapper
    &__wrapper {
      padding-left: 10px;
      margin-top: 20px;
      display: grid;
      grid-gap: 10px;
    }
    // .banner__body
    &__body {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 30px 20px;
    }
    // .banner__item
    &__item {
      border-bottom: 1px solid #e0e0e0;
    }
    // .banner__pagination
    &__pagination {
      padding-left: 10px;
      margin-top: 100px;
    }
  }
</style>
