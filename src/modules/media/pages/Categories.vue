<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Container, Draggable } from 'vue3-smooth-dnd'

  import Icon from '@/UI/Icon'
  import SButton from '@/UI/SButton.vue'
  import STabBar from '@/UI/STabBar.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'

  import PopUpCategory from '@/components/PopUpCategory.vue'
  import MainBox from '../components/MainBox.vue'

  import { ActionMenu, Tab } from '@/types/base'
  import { Category, CategoryDropResult, CategoryForm } from '../types/category'

  import {
    ADD_CATEGORY,
    DELETE_CATEGORY,
    GET_CATEGORY,
    UPDATE_CATEGORIES_POSITION,
    UPDATE_CATEGORY
  } from '../api/category.ts'

  import { applyDrag } from '@/utils/helpers'

  const { t } = useI18n()

  const tabs = ref<Tab[]>([
    { uuid: 'tm', title: 'localeTM' },
    { uuid: 'ru', title: 'localeRU' },
    { uuid: 'en', title: 'localeEN' }
  ])

  const activeTab = ref<Tab>(tabs.value[0])
  const selectTab = (tab: Tab) => {
    activeTab.value = tab
  }

  const actions = computed<ActionMenu[]>(() => [
    { uuid: 'UPDATE', icon: 'moreEdit', title: t('edit') },
    { uuid: 'DELETE', icon: 'delete', title: t('delete') }
  ])

  const selectedIndex = ref(-1)
  const selectIndex = (index: number) => {
    selectedIndex.value = selectedIndex.value === index ? -1 : index
  }

  const categories = ref<Category[]>([])
  const getCategories = async () => {
    try {
      const { data } = await GET_CATEGORY()

      categories.value = data
    } catch (error) {
      console.error(error)
    }
  }

  getCategories()

  const showPopUpCategory = ref(false)
  const openPopUpCategory = () => {
    showPopUpCategory.value = true
  }
  const closePopUpCategory = () => {
    showPopUpCategory.value = false
    selectedCategory.value = null
  }

  const selectedCategory = ref<Category | null>(null)
  const selectCategory = (category: Category) => {
    selectedCategory.value = category

    openPopUpCategory()
  }

  const selectCategoryAction = (action: ActionMenu, category: Category) => {
    switch (action.uuid) {
      case 'UPDATE':
        selectCategory(category)
        break
      case 'DELETE':
        deleteCategory(category)
        break
    }
  }

  const saveCategory = async (categoryForm: CategoryForm) => {
    try {
      if (!categoryForm.position) {
        if (categoryForm.parent_id) {
          categoryForm.position =
            categories.value?.find((category: Category) => category.uuid === categoryForm.parent_id)?.sub_categories
              ?.length || 0
        } else {
          categoryForm.position = categories.value?.length
        }
      }

      if (selectedCategory.value) {
        await UPDATE_CATEGORY({ data: categoryForm, id: selectedCategory.value.uuid })
      } else {
        await ADD_CATEGORY({ data: categoryForm })
      }
      closePopUpCategory()
      getCategories()
    } catch (error) {
      console.error(error)
    }
  }

  const deleteCategory = async (category: Category) => {
    try {
      await DELETE_CATEGORY({ id: category.uuid })
      getCategories()
    } catch (error) {
      console.error(error)
    }
  }

  const onDropCategory = (dropResult: CategoryDropResult) => {
    categories.value = applyDrag(categories.value, dropResult)
    updateCategoriesPosition(categories.value)
  }

  const updateCategoriesPosition = async (categories: Category[]) => {
    try {
      const categoriesNewPosition = categories.map((category, index) => ({
        uuid: category.uuid,
        position: index + 1
      }))

      await UPDATE_CATEGORIES_POSITION({
        data: categoriesNewPosition
      })
    } catch (error) {
      console.error(error)
    }
  }

  const getCategoryNameByLang = (category: Category) => {
    switch (activeTab.value.uuid) {
      case 'tm':
        return category.name_tm
      case 'ru':
        return category.name_ru
      case 'en':
        return category.name_en
      default:
        return ''
    }
  }
</script>

<template>
  <main-box>
    <div class="categories">
      <div class="categories__wrapper">
        <div class="categories__head">
          <div class="categories__title _page-title">{{ t('categories') }}</div>
          <div class="categories__controllers">
            <s-button @click="openPopUpCategory" prev-icon="addCircle" :title="t('addCategory')" />
          </div>
        </div>
        <div class="categories__tabs">
          <s-tab-bar @select-tab="selectTab" :tabs="tabs" :activeTab="activeTab" />
        </div>
        <div class="categories__body">
          <div class="categories__list-header">
            <div class="categories__list-drag"></div>
            <div class="categories__list-number">№</div>
            <div class="categories__list-menu-action"></div>
            <div class="categories__list-name">{{ t('category') }}</div>
            <div class="categories__list-action">
              <icon name="settings" />
            </div>
          </div>
          <Container
            @drop="onDropCategory"
            lock-axis="y"
            drag-handle-selector=".categories__list-drag"
            class="categories__list"
          >
            <Draggable
              v-for="(category, index) in categories"
              :class="[
                'categories__list-item',
                {
                  _active: selectedIndex === index
                }
              ]"
            >
              <div class="categories__list-button">
                <div class="categories__list-drag">
                  <icon name="unfoldMore" />
                </div>
                <div class="categories__list-number">{{ index + 1 }}</div>
                <div class="categories__list-menu-action">
                  <button @click="selectIndex(index)" v-if="category.sub_categories?.length">
                    <icon name="chevronDown" />
                  </button>
                </div>
                <div class="categories__list-name">{{ getCategoryNameByLang(category) }}</div>
                <div class="categories__list-action">
                  <dropdown-dots @select-item="(action) => selectCategoryAction(action, category)" :menu="actions" />
                </div>
              </div>
            </Draggable>
          </Container>
        </div>
      </div>
    </div>
  </main-box>
  <teleport to="#pop-up">
    <pop-up-category
      @close="closePopUpCategory"
      @save="saveCategory"
      :categories="categories"
      :category="selectedCategory"
      v-if="showPopUpCategory"
      :title="t('category')"
      is-sub-category
      width="358"
    />
  </teleport>
</template>

<style scoped lang="scss">
  .categories {
    width: 900px;
    padding-bottom: 50px;
    // .categories__wrapper
    &__wrapper {
    }
    // .categories__head
    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0 10px 10px;
    }
    // .categories__title
    &__title {
    }
    // .categories__controllers
    &__controllers {
    }
    // .categories__tabs
    &__tabs {
    }
    // .categories__body
    &__body {
      margin-top: 20px;
      color: var(--dark);
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      padding-left: 10px;
    }
    // .categories__list-header
    &__list-header {
      border-radius: var(--border-radius);
      background: #e9e9e9;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
    }

    // .categories__list-drag
    &__list-drag {
      width: 20px;
      height: 20px;
      z-index: 1;
      color: var(--dark);
      cursor: pointer;
      &:deep() {
        .icon {
          svg {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    // .categories__list-number
    &__list-number {
      width: 25px;
    }
    // .categories__list-menu-action
    &__list-menu-action {
      width: 20px;
      height: 20px;
      button {
        background-color: transparent;
        :deep() {
          .icon {
            svg {
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }
    // .categories__list-name
    &__list-name {
      flex: 1 1;
    }
    // .categories__list-count
    &__list-count {
      width: 200px;
    }
    // .categories__list-action
    &__list-action {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    // .categories__list
    &__list {
    }
    // .categories__list-item
    &__list-item {
      margin-top: 10px;
      overflow: visible !important;
      &._active {
        .categories__list-menu-action {
          button {
            transform: rotate(180deg);
          }
        }
      }
      // .categories__list-item_sub
      &_sub {
        .categories__list-button {
          background: #f7f7f7;
        }
      }
    }
    // .categories__list-button
    &__list-button {
      display: flex;
      gap: 10px;
      align-items: center;
      padding: 10px;
      border-radius: var(--border-radius);
      background: #ececec;
    }
    // .categories__list-menu
    &__list-menu {
      padding-left: 20px;
      margin-top: 10px;
    }
  }
</style>
