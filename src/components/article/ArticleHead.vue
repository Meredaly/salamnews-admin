<script setup lang="ts">
  import { type PropType, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import SButton from '@/UI/SButton.vue'
  import UpdateStatusDropdown from './UpdateStatusDropdown.vue'

  import { ARTICLE_STATUS, USER_STATUS } from '@/utils/constants'

  import { useAuth } from '@/store/auth'
  import { getDateTime } from '@/utils/helpers/date'
  import type { Menu } from '@/types/base'

  const { t } = useI18n()

  const emit = defineEmits([
    'cancelPlan',
    'cancelPublication',
    'sendToWaitList',
    'selectItem',
    'publish',
    'selectDate',
    'toggleNotification'
  ])

  const props = defineProps({
    status: { type: String, default: '' },
    publicationDate: { type: String, default: '' },
    publishedDate: { type: String, default: '' },
    menu: { type: Array as PropType<Menu[]>, default: [] },
    notification: { type: Boolean, default: false }
  })

  const auth = useAuth()

  const userJobTitle = computed(() => auth.getUser.job_title)

  const router = useRouter()

  const back = () => {
    router.go(-1)
  }
  const cancelPlan = () => {
    emit('cancelPlan')
  }

  const publish = () => {
    emit('publish')
  }

  const sendToWaitList = () => {
    emit('sendToWaitList')
  }

  const cancelPublication = () => {
    emit('cancelPublication')
  }

  const selectItem = (item: any) => {
    emit('selectItem', item)
  }
  const submitDatepicker = (event: any) => {
    emit('selectDate', event.target.value.toString())
  }

  const toggleNotification = () => {
    emit('toggleNotification')
  }

  const computePublishedDate = computed(() => {
    if (props.publishedDate?.includes('+')) {
      return props.publishedDate.slice(0, 19)
    } else {
      return props.publishedDate
    }
  })
</script>

<template>
  <div class="article-head">
    <div class="article-head__back">
      <s-button @click="back" :title="t('back')" styles="light" prev-icon="chevronLeft" />
    </div>
    <div
      v-if="[ARTICLE_STATUS.WRITING, ARTICLE_STATUS.WAITING, ARTICLE_STATUS.EMPTY].includes(status)"
      class="article-head__status-dropdown"
    >
      <input :value="computePublishedDate" type="datetime-local" @input="submitDatepicker" />
    </div>
    <template v-if="userJobTitle === USER_STATUS.REDACTOR">
      <div class="article-head__notification">
        <s-button
          v-if="status !== ARTICLE_STATUS.PUBLISHED"
          @click="toggleNotification"
          :prev-icon="notification ? 'notification' : 'notificationOff'"
          :styles="notification ? 'primary' : 'light'"
        />
      </div>
      <div v-if="status === ARTICLE_STATUS.PLANNING" class="article-head__plan">
        <div class="article-plan">
          <div class="article-plan__date">{{ getDateTime(publicationDate) }}</div>
          <s-button :title="t('planned')" prev-icon="calendar" styles="secondary" />
          <s-button @click="cancelPlan" styles="light" prev-icon="closeCircle" />
        </div>
      </div>
      <div v-else-if="status === ARTICLE_STATUS.PUBLISHED" class="article-head__send-to-redactor">
        <div class="article-head__published-date">{{ getDateTime(publishedDate) }}</div>
        <s-button @click="cancelPublication" append-icon="closeCircle" styles="light" :title="t('cancelPublication')" />
      </div>
      <div v-else class="article-head__status-dropdown">
        <update-status-dropdown @publish="publish" @select-item="selectItem" :menu="menu" />
      </div>
    </template>
    <template v-else>
      <div v-if="status === ARTICLE_STATUS.WRITING" @click="sendToWaitList" class="article-head__send-to-redactor">
        <s-button prev-icon="doneAll" :title="t('sendToEditor')" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
  .article-head {
    display: flex;
    align-items: center;
    gap: 10px;
    // .article-head__back
    &__back {
      flex: 1 1;
    }
    // .article-head__status-dropdown
    &__status-dropdown {
      & > input {
        background-color: #e8e8e8;
        border-radius: 4px;
        padding: 0 10px;
        height: 34px;
      }
      display: flex;
      gap: 20px;
    }
    // .article-head__send-to-redactor
    &__send-to-redactor {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    // .article-head__published-date
    &__published-date {
      border-radius: 4px;
      background: #f5f5f5;
      font-size: 14px;
      line-height: 20px;
      font-style: normal;
      font-weight: 500;
      padding: 9px 10px;
      color: #000000de;
    }
    // .article-head__plan
    &__plan {
    }
    // .article-head__notification
    &__notification {
      &:deep() {
        .button {
          padding: 6px;
        }
      }
    }
  }
  .article-plan {
    display: flex;
    align-items: center;
    gap: 4px;
    // .article-plan__date
    &__date {
      border-radius: 4px;
      background: #f5f5f5;
      font-size: 14px;
      line-height: 20px;
      font-style: normal;
      font-weight: 500;
      padding: 9px 10px;
      color: #000000de;
    }
  }
</style>
