<script setup lang="ts">
  import { computed, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'

  const { t } = useI18n()

  const emit = defineEmits(['clickPage'])

  const props = defineProps({
    count: { type: Number, default: 0 },
    limit: { type: Number, default: 0 },
    page: { type: Number, default: 1 },
    pages: { type: Number, default: 1 }
  })

  const startPage = computed(() => {
    return (props.page - 1) * props.limit + 1
  })

  const endPage = computed(() => {
    return Math.min(props.page * props.limit, props.count)
  })

  const paginationClasses = reactive({
    ul: 'pagination',
    li: 'pagination__item',
    liActive: 'pagination__item--active',
    liDisable: 'pagination__item--disabled',
    button: 'pagination__link',
    buttonActive: 'pagination__link--active',
    buttonDisable: 'pagination__link--disable'
  })

  const items = computed(() => {
    let valPrev = props.page > 1 ? props.page - 1 : 1 // for easier navigation - gives one previous page
    let valNext = props.page < props.pages ? props.page + 1 : props.pages // one next page
    let extraPrev = valPrev === 3 ? 2 : null
    let extraNext = valNext === props.pages - 2 ? props.pages - 1 : null
    let dotsBefore = valPrev > 3 ? 2 : null
    let dotsAfter = valNext < props.pages - 2 ? props.pages - 1 : null
    let output = []
    for (let i = 1; i <= props.pages; i += 1) {
      if ([1, props.pages, props.page, valPrev, valNext, extraPrev, extraNext, dotsBefore, dotsAfter].includes(i)) {
        output.push({
          label: i,
          active: props.page === i,
          disable: [dotsBefore, dotsAfter].includes(i)
        })
      }
    }
    return output
  })

  const hasFirst = computed(() => {
    return props.page === 1
  })
  const hasLast = computed(() => {
    return props.page === props.pages
  })

  const prev = () => {
    !hasFirst && emit('clickPage', props.page - 1)
  }
  const goto = (page: number) => {
    emit('clickPage', page)
  }
  const next = () => {
    !hasLast && emit('clickPage', props.page + 1)
  }
</script>

<template>
  <div class="pagination">
    <div class="pagination_info">
      <p>{{ t('shown') }} {{ t('from') }} {{ startPage }} {{ t('to') }} {{ endPage }} {{ t('in') }} {{ count }}</p>
    </div>
    <div class="pagination__pages">
      <div :class="`pagination__item pagination__item--arrow ${hasFirst ? paginationClasses.liDisable : ''}`">
        <button
          @click="prev"
          :disabled="hasFirst"
          :class="`pagination__link ${hasFirst ? paginationClasses.buttonDisable : ''}`"
        >
          <icon name="arrowEndLeft" />
        </button>
      </div>
      <div
        v-for="page in items"
        :key="page.label"
        :class="`pagination__item ${page.disable ? paginationClasses.liDisable : ''}`"
      >
        <span v-if="page.disable" :class="`pagination__item ${paginationClasses.buttonDisable}`"> ... </span>
        <button
          v-else
          @click="goto(page.label)"
          :class="`pagination__link ${page.active ? paginationClasses.buttonActive : ''}`"
        >
          {{ page.label }}
        </button>
      </div>
      <div :class="`pagination__item pagination__item--arrow ${hasLast ? paginationClasses.liDisable : ''}`">
        <button
          @click="next"
          :disabled="hasLast"
          :class="`pagination__link ${hasLast ? paginationClasses.buttonDisable : ''}`"
        >
          <icon name="arrowEndRight" />
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    // .pagination_info
    &_info {
      color: rgba(0, 0, 0, 0.54);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
    }
    // .pagination__pages
    &__pages {
      display: flex;
      align-items: center;
      gap: 3px;
    }
    // .pagination__item
    &__item {
      color: var(--accent);
    }
    // .pagination__item--arrow
    &__item--arrow {
      color: var(--black);
    }
    // .pagination__item--disabled
    &__item--disabled {
      color: var(--black);
      opacity: 0.87;
      user-select: none;
      pointer-events: none;
    }
    // .pagination__link
    &__link {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: transparent;
      color: inherit;
      &:hover {
        color: var(--accent);
        background: rgba(223, 47, 47, 0.24);
      }
    }
    // .pagination__link--active
    &__link--active {
      background: rgba(223, 47, 47, 0.24);
      color: var(--accent);
    }
    // .pagination__link--disabled
    &__link--disabled {
      color: var(--black);
      user-select: none;
      pointer-events: none;
    }
  }
</style>
