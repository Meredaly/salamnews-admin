<script setup lang="ts">
  import { ref, computed, PropType } from 'vue'
  import { useI18n } from 'vue-i18n'

  import SRow from '@/UI/SRow.vue'
  import SCol from '@/UI/SCol.vue'
  import STextField from '@/UI/STextField.vue'
  import SDropdown from '@/UI/SDropdown.vue'
  import SButton from '@/UI/SButton.vue'
  import PopUpBody from '@/components/PopUpBody.vue'

  import { Category, CategoryForm } from '@/types/base'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    category: {
      type: Object as PropType<Category | null>,
      default: null
    },
    parentId: {
      type: String as PropType<string | null>,
      default: null
    },
    categories: {
      type: Array as PropType<Category[]>,
      default: []
    },
    isSubCategory: {
      type: Boolean,
      default: false
    }
  })

  const { t, locale } = useI18n()

  const categoryForm = ref<CategoryForm>({
    name_tm: '',
    name_ru: '',
    name_en: '',
    category_slug: '',
    parent_id: null,
    position: 0
  })

  const selectParentCategoryId = (category: Category) => {
    categoryForm.value.parent_id = category.category_slug || null
  }
  const deleteParentCategoryId = () => {
    categoryForm.value.parent_id = null
    categoryForm.value.position = 0
  }

  const categoriesMenu = computed(() => {
    return props.categories?.map((category: Category): any => {
      const title = locale.value === 'tm' ? category.name_tm : category.name_ru

      return {
        ...category,
        title
      }
    })
  })
  const selectedParentCategory = computed(() => {
    return categoriesMenu.value?.find((category) => category.category_slug === categoryForm.value.parent_id) || null
  })

  const close = () => {
    emit('close')
  }

  const save = () => {
    emit('save', categoryForm.value)
  }

  if (props.category) {
    categoryForm.value = {
      name_tm: props.category.name_tm,
      name_ru: props.category.name_ru,
      name_en: props.category.name_en,
      category_slug: props.category.category_slug,
      parent_id: props.parentId,
      position: props.category.position
    }
  }
</script>

<template>
  <pop-up-body @close="close">
    <s-row>
      <s-col cols="12">
        <s-text-field v-model.trim="categoryForm.category_slug" :label="`Slug`" />
      </s-col>
      <s-col cols="12">
        <s-text-field v-model.trim="categoryForm.name_tm" :label="`${t('name')} (tm)`" />
      </s-col>
      <s-col cols="12">
        <s-text-field v-model.trim="categoryForm.name_ru" :label="`${t('name')} (ru)`" />
      </s-col>
      <s-col cols="12">
        <s-text-field v-model.trim="categoryForm.name_en" :label="`${t('name')} (en)`" />
      </s-col>
      <s-col v-if="isSubCategory === false" cols="12">
        <s-dropdown
          :selected-item="selectedParentCategory"
          @select-item="selectParentCategoryId"
          @clear="deleteParentCategoryId"
          :menu="categoriesMenu"
          :label="t('parentCategory')"
        />
      </s-col>
    </s-row>
    <template #bot>
      <div class="_flex _flex-justify-end _gap-20">
        <s-button @click="close" :title="t('cancel')" styles="secondary" outline large />
        <s-button @click="save" :title="t('save')" large />
      </div>
    </template>
  </pop-up-body>
</template>

<style scoped lang="scss"></style>
