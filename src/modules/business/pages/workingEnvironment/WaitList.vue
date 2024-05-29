<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import SButton from '@/UI/SButton.vue'
  import ArticlesHorizontal from '@/components/ArticlesHorizontal.vue'

  import WorkingEnvironmentHead from '../../components/WorkingEnvironmentHead.vue'
  import { GET_WAIT_LIST } from '../../api/whiteboard'

  const router = useRouter()
  const route = useRoute()

  const { t } = useI18n()

  const langs = ref([
    { id: 'TKM', title: t('localeTM') },
    { id: 'RUS', title: t('localeRU') },
    { id: 'ENG', title: t('localeEN') }
  ])
  const currentLang = ref<any>(null)

  const waitList = ref([])

  const getWaitList = async (): Promise<void> => {
    try {
      const { data } = await GET_WAIT_LIST({
        params: {
          language: currentLang.value?.id || ''
        }
      })
      waitList.value = data || []
    } catch (error) {
      console.error(error)
    }
  }
  const selectLang = (lang: any) => {
    if (currentLang.value?.id === lang.id) {
      currentLang.value = null
    } else {
      currentLang.value = lang
    }
    goToPath()
  }

  const goToPath = () => {
    router.push({
      path: `/business/working-environment/wait-list`,
      query: {
        lang: currentLang.value?.id || ''
      }
    })
    getWaitList()
  }

  const openNews = ({ article, index }: any) => {
    index
    router.push(`/business/article/${article.uuid}`)
  }

  onMounted(() => {
    switch (route.query.lang?.toString() || '') {
      case 'TKM':
        currentLang.value = langs.value[0]
        break
      case 'RUS':
        currentLang.value = langs.value[1]
        break
      case 'ENG':
        currentLang.value = langs.value[2]
        break
      default:
        currentLang.value = null
        break
    }
    getWaitList()
  })
</script>

<template>
  <div class="wait-list">
    <div class="wait-list__head">
      <working-environment-head>
        <div class="wait-list__langs">
          <s-button
            v-for="lang in langs"
            :title="lang.title"
            :styles="currentLang?.id === lang.id ? 'primary' : 'secondary'"
            @click="selectLang(lang)"
            :outline="currentLang?.id !== lang.id"
          />
        </div>
      </working-environment-head>
    </div>
    <div class="wait-list__articles">
      <articles-horizontal :articles="waitList" @open="openNews" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .wait-list {
    width: 900px;
    // .wait-list__head
    &__head {
    }
    // .wait-list__langs
    &__langs {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    // .wait-list__articles
    &__articles {
      padding-top: 20px;
    }
  }
</style>
