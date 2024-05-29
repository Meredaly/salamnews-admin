import { ref } from 'vue'

export function useAutoHeight() {
  const autoHeightRef = ref<null | HTMLInputElement>(null)

  const initAutoHeight = () => {
    setTimeout(() => {
      if (autoHeightRef.value) {
        autoHeightRef.value.style.overflowY = 'hidden'
        autoHeightRef.value.style.height = autoHeightRef.value.scrollHeight + 'px'
      }
      autoHeightRef.value?.addEventListener(
        'input',
        () => {
          if (autoHeightRef.value) {
            autoHeightRef.value.style.height = '0px'
            autoHeightRef.value.style.height = autoHeightRef.value.scrollHeight + 'px'
          }
        },
        false
      )
    }, 0)
  }

  return {
    autoHeightRef,
    initAutoHeight
  }
}
