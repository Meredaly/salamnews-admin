<script setup lang="ts">
  import Icon from '@/UI/Icon'

  import { useBase } from '@/store/base'

  const emit = defineEmits(['changeFile'])

  defineProps({
    photo: { type: String, default: '' }
  })

  const base = useBase()

  const changeFiles = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target && target.files?.length) emit('changeFile', target.files[0])
  }
</script>

<template>
  <div class="banner-image-uploader">
    <div class="banner-image-uploader__upload-image">
      <label class="banner-image-uploader__upload-label">
        <div class="banner-image-uploader__upload-icon">
          <icon name="addCircle" />
        </div>
        <input @change="changeFiles" type="file" accept="image/*" />
        <div class="banner-image-uploader__image">
          <img v-if="photo" :src="`${base.baseURL}${photo}`" />
        </div>
      </label>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .banner-image-uploader {
    // .banner-image-uploader__upload-image
    &__upload-image {
      &:hover {
        .banner-image-uploader__image {
          z-index: -1;
        }
      }
    }
    // .banner-image-uploader__upload-label
    &__upload-label {
      background: #efefef;
      display: block;
      position: relative;
      cursor: pointer;
      min-height: 150px;
      input {
        display: none;
      }
    }
    // .banner-image-uploader__upload-icon
    &__upload-icon {
      border-radius: 4px;
      padding: 6px;
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
    // .banner-image-uploader__description
    &__description {
      margin-top: 10px;
    }
    // .banner-image-uploader__image
    &__image {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
      }
    }
  }
</style>
