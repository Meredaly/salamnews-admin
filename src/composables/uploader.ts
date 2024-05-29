import { ref, watchEffect } from 'vue'
// import { UPLOAD_VIDEOS } from '@/api'
const UPLOAD_VIDEOS = (data: any): any => {
  data
  return {}
}
export function useUploader() {
  const chunkSize = 10 * 1024

  const files = ref<any[]>([])
  const currentFileIndex = ref<number | null>(null)
  const lastUploadedFileIndex = ref<number | null>(null)
  const currentChunkIndex = ref<number | null>(null)

  const uploadChunk = async (file: any, dataVideos: string) => {
    try {
      const { data, status } = await UPLOAD_VIDEOS({
        params: {
          name: file.name,
          size: file.size,
          currentChunkIndex: currentChunkIndex.value,
          totalChunks: Math.ceil(file.size / chunkSize)
        },
        data: { dataVideos }
      })
      if (status === 200) {
        const fileSize = file.size
        const isLastChunk = currentChunkIndex.value === Math.ceil(fileSize / chunkSize) - 1
        if (isLastChunk) {
          file.finalFilename = data.finalFilename
          lastUploadedFileIndex.value = currentFileIndex.value
          currentChunkIndex.value = null
        } else {
          currentChunkIndex.value = currentChunkIndex.value! + 1
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const readAndUploadCurrentChunk = () => {
    const file = files.value[currentFileIndex.value!]

    if (!file) {
      return
    }

    const from = currentChunkIndex.value! * chunkSize
    const to = from + chunkSize
    const blob = file.slice(from, to)

    const reader = new FileReader()
    reader.onload = (e) => uploadChunk(file, e.target?.result as string)
    reader.readAsDataURL(blob)
  }

  const updateFileIndex = () => {
    const isLastFile = lastUploadedFileIndex.value === null ? 0 : lastUploadedFileIndex.value + 1
    currentFileIndex.value = isLastFile ? null : currentFileIndex.value! + 1
  }

  watchEffect(() => {
    if (files.value.length > 0 && currentFileIndex.value === null) {
      currentFileIndex.value = lastUploadedFileIndex.value === null ? 0 : lastUploadedFileIndex.value + 1
    }

    if (currentFileIndex.value !== null) {
      currentChunkIndex.value = 0
      readAndUploadCurrentChunk()
    }

    if (lastUploadedFileIndex.value !== null) {
      updateFileIndex()
    }

    if (currentChunkIndex.value !== null) {
      readAndUploadCurrentChunk()
    }
  })
}
