<script setup lang="ts">
  import type { PropType } from 'vue'
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'
  import SButton from '@/UI/SButton.vue'

  import { useDropdown } from '@/composables/dropdown'

  const emit = defineEmits(['selectCategory', 'deleteCategory'])

  defineProps({
    categories: { type: Array as PropType<any>, default: () => [] },
    selectedCategories: { type: Array as PropType<any>, default: () => [] }
  })

  const { t, locale } = useI18n()

  const { dropdownBody, dropdownMenu, showDropdown, closeDropdown, openDropdown } = useDropdown()

  const selectCategory = (category: any, parent: any) => {
    if (parent) {
      emit('selectCategory', {
        ...category,
        parent_id: parent.uuid,
        parent_name_ru: parent.name_ru,
        parent_name_tm: parent.name_tm
      })
      return
    }
    emit('selectCategory', category)
  }
  const deleteCategory = (category: any) => {
    emit('deleteCategory', category)
  }
</script>

<template>
  <div class="article-categories">
    <div class="article-categories__dropdown">
      <div ref="dropdownBody" class="article-category-dropdown">
        <div class="article-category-dropdown__button">
          <s-button
            @click="showDropdown ? closeDropdown() : openDropdown()"
            :title="t('selectCategory')"
            prev-icon="grading"
            append-icon="chevronDown"
            styles="secondary"
          />
        </div>
        <div v-if="showDropdown" ref="dropdownMenu" class="article-category-dropdown__menu">
          <template v-for="category in categories" :key="category.uuid">
            <div class="article-category-dropdown__item-box">
              <div @click="selectCategory(category, null)" class="article-category-dropdown__item-button">
                <p>{{ locale === 'tm' ? category.name_tm : category.name_ru }}</p>
                <icon v-if="category.sub_categories?.length" name="chevronRight" />
              </div>
              <div v-if="category.sub_categories?.length" class="article-category-dropdown__sub">
                <div class="article-category-dropdown__sub-menu">
                  <div
                    v-for="subCategory in category.sub_categories"
                    :key="subCategory.uuid"
                    @click="selectCategory(subCategory, category)"
                    class="article-category-dropdown__item-button"
                  >
                    <p>
                      {{ locale === 'tm' ? subCategory.name_tm : subCategory.name_ru }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-for="selectedCategory in selectedCategories" class="article-categories__selected-category">
      <p>{{ selectedCategory.name }}</p>
      <button @click="deleteCategory(selectedCategory)">
        <icon name="closeCircle" />
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .article-categories {
    display: flex;
	
    gap: 9px;
    flex-wrap: wrap;

    // .article-categories__dropdown
    &__dropdown {
    }
    // .article-categories__selected-category
    &__selected-category {
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 4px;
      background: rgba(158, 158, 158, 0.2);
      overflow: hidden;
      p {
        color: #1d192b;
        text-align: left;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: 0.1px;
        padding: 7px 8px 7px 12px;
      }
      button {
        background-color: transparent;
        padding: 8px;
        &:deep() {
          svg {
            width: 18px;
            height: 18px;
          }
        }
      }
    }
  }
  .article-category-dropdown {
    position: relative;
    // .article-category-dropdown__button
    &__button {
    }
    // .article-category-dropdown__menu
    &__menu {
      position: absolute;
      left: 0;
      top: calc(100% + 5px);
      min-width: 100%;
      width: max-content;
      border-radius: 4px;
      background: var(--white);
      box-shadow: -2px 4px 21px 0px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px 0;
      z-index: 2;
    }
    // .article-category-dropdown__item-box
    &__item-box {
      position: relative;
      &:hover {
        .article-category-dropdown__sub {
          display: block;
        }
      }
    }
    // .article-category-dropdown__item-button
    &__item-button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
      color: #333;
      font-size: 14px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      padding: 5px 10px;
      p {
        line-height: 24px;
      }
      &:deep() {
        svg {
          width: 24px;
          height: 24px;
        }
      }
      &:hover {
        background: #f7f7f7;
      }
    }
    // .article-category-dropdown__sub
    &__sub {
      position: absolute;
      left: 100%;
      padding-left: 4px;
      top: 0;
      display: none;
    }
    // .article-category-dropdown__sub-menu
    &__sub-menu {
      border-radius: 4px;
      background: var(--white);
      box-shadow: -2px 4px 21px 0px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px 0;
      width: max-content;
    }
    // .article-category-dropdown__sub-item
    &__sub-item {
    }
  }
</style>
