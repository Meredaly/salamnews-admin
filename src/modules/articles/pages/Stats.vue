<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  import SDatepicker from '@/UI/SDatepicker'
  import MainBox from '../components/MainBox.vue'
  import ChartCategoryAdded from '../components/charts/ChartCategoryAdded.vue'

  const { t } = useI18n()

  const categoryLabels = [
    'Category1',
    'Category2',
    'Category3',
    'Category4',
    'Category5',
    'Category6',
    'Category7',
    'Category8',
    'Category9',
    'Category10',
    'Category11',
    'Category12'
  ]
  const categoryData = [12, 18, 24, 6, 1, 2, 13, 10, 5, 7, 8, 9]
</script>

<template>
  <main-box class="stats-main-box">
    <div class="stats">
      <div class="stats__wrapper">
        <div class="stats__head">
          <div class="stats__title">{{ t('stats') }}</div>
          <div class="stats__controllers">
            <div class="stats__date-area">
              <s-datepicker width="150px" right />
              <span>-</span>
              <s-datepicker width="150px" right />
            </div>
          </div>
        </div>
        <div class="stats__published">
          <div class="stats-published">
            <div class="stats-published__title">{{ t('publishedNews') }}</div>
            <div class="stats-published__box">
              <div class="stats-published__item">
                <div class="stats-published__name">{{ t('totalNumber') }}</div>
                <div class="stats-published__count">1200</div>
              </div>
              <div class="stats-published__item">
                <div class="stats-published__name">{{ t('localeTM') }}</div>
                <div class="stats-published__count">500</div>
              </div>
              <div class="stats-published__item">
                <div class="stats-published__name">{{ t('localeRU') }}</div>
                <div class="stats-published__count">700</div>
              </div>
            </div>
          </div>
        </div>
        <div class="stats__pinned">
          <div class="stats-pinned">
            <div class="stats-pinned__title">{{ t('statPinned') }}</div>
            <div class="stats-pinned__box">
              <div class="stats-pinned__item">
                <div class="stats-pinned__name">{{ t('localeTM') }}</div>
                <div class="stats-pinned__count">500</div>
              </div>
              <div class="stats-pinned__item">
                <div class="stats-pinned__name">{{ t('localeRU') }}</div>
                <div class="stats-pinned__count">700</div>
              </div>
            </div>
          </div>
        </div>
        <div class="stats__status">
          <div class="stats-status">
            <div class="stats-status__title">{{ t('workingEnvironment') }}</div>
            <div class="stats-status__wrapper">
              <div class="stats-status__box">
                <div class="stats-status__box-title">{{ t('empty') }}</div>
                <div class="stats-status__items">
                  <div class="stats-status__item">
                    <div class="stats-status__name">{{ t('localeTM') }}</div>
                    <div class="stats-status__count">10</div>
                  </div>
                  <div class="stats-status__item">
                    <div class="stats-status__name">{{ t('localeRU') }}</div>
                    <div class="stats-status__count">10</div>
                  </div>
                </div>
              </div>
              <div class="stats-status__box">
                <div class="stats-status__box-title">{{ t('distributed') }}</div>
                <div class="stats-status__items">
                  <div class="stats-status__item">
                    <div class="stats-status__name">{{ t('localeTM') }}</div>
                    <div class="stats-status__count">10</div>
                  </div>
                  <div class="stats-status__item">
                    <div class="stats-status__name">{{ t('localeRU') }}</div>
                    <div class="stats-status__count">10</div>
                  </div>
                </div>
              </div>
              <div class="stats-status__box">
                <div class="stats-status__box-title">{{ t('waiting') }}</div>
                <div class="stats-status__items">
                  <div class="stats-status__item">
                    <div class="stats-status__name">{{ t('localeTM') }}</div>
                    <div class="stats-status__count">10</div>
                  </div>
                  <div class="stats-status__item">
                    <div class="stats-status__name">{{ t('localeRU') }}</div>
                    <div class="stats-status__count">10</div>
                  </div>
                </div>
              </div>
              <div class="stats-status__box">
                <div class="stats-status__box-title">{{ t('planned') }}</div>
                <div class="stats-status__items">
                  <div class="stats-status__item">
                    <div class="stats-status__name">{{ t('localeTM') }}</div>
                    <div class="stats-status__count">10</div>
                  </div>
                  <div class="stats-status__item">
                    <div class="stats-status__name">{{ t('localeRU') }}</div>
                    <div class="stats-status__count">10</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="stats__diagram">
          <div class="stats-diagram">
            <div class="stats-diagram__title">{{ t('numberMessageAcrossCategories') }}</div>
            <div class="stats-diagram__chart">
              <chart-category-added :labels="categoryLabels" :data="categoryData" />
            </div>
          </div>
        </div>
        <div class="stats__diagram">
          <div class="stats-diagram">
            <div class="stats-diagram__title">{{ t('numberMessageAcrossSubCategories') }}</div>
            <div class="stats-diagram__chart">
              <chart-category-added :labels="categoryLabels" :data="categoryData" />
            </div>
          </div>
        </div>
        <div class="stats__diagram">
          <div class="stats-diagram">
            <div class="stats-diagram__title">{{ t('numberNewsViewsAcrossCategories') }}</div>
            <div class="stats-diagram__chart">
              <chart-category-added :labels="categoryLabels" :data="categoryData" />
            </div>
          </div>
        </div>
        <div class="stats__diagram">
          <div class="stats-diagram">
            <div class="stats-diagram__title">{{ t('numberNewsViewsAcrossSubCategories') }}</div>
            <div class="stats-diagram__chart">
              <chart-category-added :labels="categoryLabels" :data="categoryData" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main-box>
</template>

<style scoped lang="scss">
  .stats-main-box {
    &:deep() {
      .main-box__container {
        max-width: 100%;
        padding-right: 0;
        padding-left: calc(50vw - 700px);
      }
    }
  }
  .stats {
    background-color: #f6f6f6;
    height: 100%;
    // .stats__wrapper
    &__wrapper {
      padding: 20px;
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-gap: 20px;
    }
    // .stats__head
    &__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      grid-column-start: span 12;
    }
    // .stats__title
    &__title {
      font-family: $secondFont;
      font-size: 24px;
      font-weight: 700;
    }
    // .stat__controllers
    &__controllers {
      flex: 1 1;
      display: flex;
      justify-content: flex-end;
    }
    // .stats__date-area
    &__date-area {
      display: flex;
      align-items: center;
      gap: 10px;
      &:deep() {
        .date-picker__button {
          background-color: var(--white);
        }
      }
    }
    // .stats__published
    &__published {
      grid-column-start: span 7;
    }

    // .stats__pinned
    &__pinned {
      grid-column-start: span 5;
    }
    // .stats__status
    &__status {
      grid-column-start: span 12;
    }

    // .stats__diagram
    &__diagram {
      grid-column-start: span 12;
    }
  }

  .stats-published {
    padding: 20px;
    background-color: var(--white);
    border-radius: 10px;
    // .stats-published__title
    &__title {
      font-size: 16px;
      font-weight: 600;
    }
    // .stats-published__box
    &__box {
      margin-top: 20px;
      display: flex;
    }
    // .stats-published__item
    &__item {
      padding: 0 20px;
      border-left: 1px solid #e4e4e4;
      flex: 1 1;
      &:first-child {
        grid-column-start: span 2;
        padding-left: 0;
        border-left: none;
      }
    }
    // .stats-published__name
    &__name {
      font-size: 14px;
      font-weight: 300;
    }
    // .stats-published__count
    &__count {
      margin-top: 10px;
      font-size: 40px;
      font-weight: 600;
      color: #474747;
    }
  }

  .stats-pinned {
    padding: 20px;
    background-color: var(--white);
    border-radius: 10px;
    width: 100%;
    // .stats-pinned__title
    &__title {
      font-size: 16px;
      font-weight: 600;
    }
    // .stats-pinned__box
    &__box {
      margin-top: 20px;
      display: flex;
    }
    // .stats-pinned__item
    &__item {
      padding: 0 20px;
      border-left: 1px solid #e4e4e4;
      flex: 1 1;
      &:first-child {
        padding-left: 0;
        border-left: none;
      }
    }
    // .stats-pinned__name
    &__name {
      font-size: 14px;
      font-weight: 300;
    }
    // .stats-pinned__count
    &__count {
      margin-top: 10px;
      font-size: 40px;
      font-weight: 600;
      color: #474747;
    }
  }

  .stats-status {
    margin-top: 20px;
    // .stats-status__title
    &__title {
      font-size: 20px;
      font-weight: 600;
    }
    // .stats-status__wrapper
    &__wrapper {
      display: grid;
      grid-gap: 20px;
      grid-template-columns: repeat(4, 1fr);
      margin-top: 10px;
    }
    // .stats-status__box
    &__box {
      background-color: var(--white);
      padding: 20px;
      border-radius: 10px;
    }
    // .stats-status__box-title
    &__box-title {
      font-size: 16px;
      font-weight: 600;
    }
    // .stats-status__items
    &__items {
      margin-top: 20px;
      display: flex;
    }
    // .stats-status__item
    &__item {
      padding: 0 20px;
      border-left: 1px solid #e4e4e4;
      flex: 1 1;
      &:first-child {
        grid-column-start: span 2;
        padding-left: 0;
        border-left: none;
      }
    }
    // .stats-status__name
    &__name {
      font-size: 13px;
      font-weight: 300;
    }
    // .stats-status__count
    &__count {
      margin-top: 10px;
      font-size: 30px;
      font-weight: 600;
      color: #474747;
    }
  }

  .stats-diagram {
    padding: 20px;
    background-color: var(--white);
    border-radius: 10px;
    width: 100%;
    // .stats-diagram__title
    &__title {
      font-size: 16px;
      font-weight: 600;
    }
    // .stats-diagram__chart
    &__chart {
      height: 250px;
      margin-top: 10px;
    }
  }
</style>
