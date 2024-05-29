<script setup lang="ts">
  import { ref } from 'vue'
  import HLSCore from '@cloudgeek/playcore-hls'
  import { useI18n } from 'vue-i18n'

  import ArticleTextarea from './ArticleTextarea.vue'
  import Icon from '@/UI/Icon'
  import SButton from '@/UI/SButton.vue'

  import { useBase } from '@/store/base'

  const { t } = useI18n()

  const emit = defineEmits(['delete', 'update:author', 'update:description', 'changePosterFile', 'changeVideoFile'])

  defineProps({
    deletable: { type: Boolean, default: false },
    author: { type: String, default: '' },
    description: { type: String, default: '' },
    poster: { type: String, default: '' },
    video_path: { type: String, default: '' },
    progress: { type: Number, default: 0 },
    status: { type: String, default: 'EMPTY' },
    pixel: { type: Number, default: 0 }
  })

  const base = useBase()

  const updateAuthor = (author: string) => {
    emit('update:author', author)
  }
  const updateDescription = (author: string) => {
    emit('update:description', author)
  }

  const changePosterFiles = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target && target.files?.length) emit('changePosterFile', target.files[0])
  }

  const changeVideoFiles = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target && target.files?.length) emit('changeVideoFile', target.files[0])
  }

  const showEdit = ref(false)

  const openEdit = () => {
    showEdit.value = true
  }

  const cancelEdit = () => {
    showEdit.value = false
  }

  const deleteVideo = () => {
    emit('delete')
  }

  const statusValue = {
    EMPTY: { class: '_empty', icon: 'videoOff' },
    CUTTING: { class: '_cutting', icon: 'contentCut' },
    DONE: { class: '_done', icon: 'check' },
    ERROR: { class: '_error', icon: 'errorCircle' }
  } as any
</script>

<template>
  <div class="article-video-uploader">
    <div class="article-video-uploader__head">
      <div class="article-video-uploader__author">
        <article-textarea :value="author" @update="updateAuthor" :placeholder="t('author')" text-end />
      </div>
      <div v-if="showEdit" class="article-video-uploader__delete">
        <s-button @click="cancelEdit" prev-icon="cancel" :title="t('canceled')" />
      </div>
      <div v-if="deletable && !showEdit" @click="deleteVideo" class="article-video-uploader__delete">
        <s-button prev-icon="deleteForever" :title="t('delete')" />
      </div>
    </div>
    <div class="article-video-uploader__body">
      <div v-if="showEdit" class="article-video-uploader__upload-box">
        <div class="article-video-uploader__upload-poster">
          <label class="article-video-uploader__upload-label">
            <div class="article-video-uploader__upload-icon">
              <icon name="addCircle" />
            </div>
            <div class="article-video-uploader__upload-type">
              <icon name="photo" />
            </div>
            <input @change="changePosterFiles" type="file" />
          </label>
          <img v-if="poster" :src="`${base.baseURL}${poster}-1000.webp`" />
        </div>
        <div class="article-video-uploader__upload-video">
          <label class="article-video-uploader__upload-label">
            <div v-if="progress === 0" class="article-video-uploader__upload-icon">
              <icon name="addCircle" />
            </div>
            <div v-else-if="progress <= 100" class="article-video-uploader__upload-progress">
              <icon name="uploadLoader" />
              <span>{{ progress }}%</span>
            </div>
            <div v-else :class="['article-video-uploader__uploaded-status', statusValue[status].class]">
              <icon :name="statusValue[status].icon" />
            </div>
            <div class="article-video-uploader__upload-type">
              <icon name="videoCam" />
            </div>
            <input @change="changeVideoFiles" type="file" />
          </label>
        </div>
      </div>
      <div v-else class="article-video-uploader__presentation">
        <div class="article-video-uploader-presentation">
          <div class="article-video-uploader-presentation__controllers">
            <div :class="['article-video-uploader-presentation__status', statusValue[status].class]">
              <icon :name="statusValue[status].icon" />
            </div>
            <button @click="openEdit" class="article-video-uploader-presentation__edit">
              <icon name="moreEdit" />
              <p>{{ t('edit') }}</p>
            </button>
          </div>
          <div class="article-video-uploader-presentation__body">
            <div v-if="poster && !video_path" class="article-video-uploader-presentation__poster">
              <img :src="`${base.baseURL}${poster}-1000.webp`" />
            </div>
            <div v-else-if="video_path" class="article-video-uploader-presentation__video-player">
              <vue3-video-player
                :core="HLSCore"
                :src="`https://admin-api.salamnews.tm/${video_path}${720}p.m3u8`"
                :preload="'none'"
                :cover="`${base.baseURL}${poster}-1000.webp`"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="article-video-uploader__description">
      <article-textarea :value="description" @update="updateDescription" :placeholder="t('description')" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .article-video-uploader {
    padding: 20px 0;
    border-top: 1px solid #c9c9c9;
    border-bottom: 1px solid #c9c9c9;

    // .article-video-uploader__head
    &__head {
      display: flex;
      gap: 10px;
    }
    // .article-video-uploader__author
    &__author {
      flex: 1 1;
    }
    // .article-video-uploader__delete
    &__delete {
    }
    // .article-video-uploader__body
    &__body {
      margin-top: 10px;
    }
    // .article-video-uploader__upload-box
    &__upload-box {
      display: flex;
      gap: 20px;
    }
    // .article-video-uploader__upload-poster
    &__upload-poster {
      flex: 1 1;
      width: 0;
      position: relative;
      background: #efefef;
      border-radius: 4px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 4px;
        z-index: 1;
      }
      &:hover {
        .article-video-uploader__upload-label {
          z-index: 2;
        }
      }
    }
    // .article-video-uploader__upload-label
    &__upload-label {
      border-radius: 4px;
      background: rgba(239, 239, 239, 0.5);
      display: block;
      position: relative;
      cursor: pointer;
      input {
        display: none;
      }
      &::before {
        content: '';
        padding-top: 74.125%;
        display: block;
      }
    }
    // .article-video-uploader__upload-icon
    &__upload-icon {
      border-radius: 4px;
      padding: 12.5px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--white);
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    // .article-video-uploader__upload-type
    &__upload-type {
      color: #323232;
      padding: 4px;
      position: absolute;
      bottom: 10px;
      left: 10px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.2);
    }
    // .article-video-uploader__upload-video
    &__upload-video {
      flex: 1 1;
      width: 0;
    }
    // .article-video-uploader__upload-progress
    &__upload-progress {
      border-radius: 4px;
      padding: 5px 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--white);
      background: rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      &:deep(.icon) {
        animation: rotate 2s infinite linear;
        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }
      }
      span {
        margin-top: 10px;
        color: var(--dark);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
    }
    // article-video-uploader__uploaded-status
    &__uploaded-status {
      border-radius: 4px;
      padding: 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--white);
      background: rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      &._cutting {
        background-color: rgb(177, 113, 10);
      }
      &._done {
        background-color: rgb(16, 135, 66);
      }
      &._error {
        background-color: rgb(177, 10, 10);
      }
    }
    // .article-video-uploader__description
    &__description {
      margin-top: 10px;
    }
    // .article-video-uploader__presentation
    &__presentation {
    }
  }
  .article-video-uploader-presentation {
    position: relative;
    // .article-video-uploader-presentation__controllers
    &__controllers {
      position: absolute;
      z-index: 2;
      top: 20px;
      right: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    // .article-video-uploader-presentation__status
    &__status {
      padding: 7px;
      border-radius: 4px;
      color: var(--white);
      background-color: rgb(208, 208, 208);
      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
      &._cutting {
        background-color: rgb(177, 113, 10);
      }
      &._done {
        background-color: rgb(16, 135, 66);
      }
      &._error {
        background-color: rgb(177, 10, 10);
      }
    }
    // .article-video-uploader-presentation__edit
    &__edit {
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 7px 10px;
      color: var(--white);
      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
      &:hover {
        background-color: #000;
      }
    }
    // .article-video-uploader-presentation__body
    &__body {
      border-radius: 4px;
      background: #efefef;
      display: block;
      position: relative;
      overflow: hidden;
      &::before {
        content: '';
        padding-top: 74.125%;
        display: block;
      }
    }
    // .article-video-uploader-presentation__poster
    &__poster {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
    // .article-video-uploader-presentation__play
    &__play {
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.4);
      padding: 5px;
      color: var(--white);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      &:deep() {
        svg {
          width: 50px;
          height: 50px;
        }
      }
    }

    // .article-video-uploader-presentation__video-player
    &__video-player {
      z-index: 1;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
