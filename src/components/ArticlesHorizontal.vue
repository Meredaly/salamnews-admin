<script setup lang="ts">
  import ArticleHorizontal from './ArticleHorizontal.vue'

  const emit = defineEmits(['open'])

  defineProps({
    articles: {
      type: Array as any,
      default: []
    }
  })

  const open = (article: any, index: number) => {
    emit('open', { article: article, index: index })
  }
</script>

<template>
  <div class="articles-horizontal">
    <div class="articles-horizontal__wrapper">
      <div class="articles-horizontal__list">
        <div v-for="(article, index) in articles" :key="articles.uuid" class="articles-horizontal__item">
          <article-horizontal @open="open(article, index)" :article="article" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .articles-horizontal {
    // .articles-horizontal__wrapper
    &__wrapper {
    }
    // .articles-horizontal__list
    &__list {
    }
    // .articles-horizontal__item
    &__item {
      border-bottom: 1px solid #e0e0e0;
    }
  }
</style>
