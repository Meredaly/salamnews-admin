<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { Container } from 'vue3-smooth-dnd'
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'
  import WhiteboardTask from '../../components/WhiteboardTask.vue'
  import WhiteboardWriter from '../../components/WhiteboardWriter.vue'
  import WorkingEnvironmentHead from '../../components/WorkingEnvironmentHead.vue'
  import PopUpTask from '@/components/PopUpTask.vue'

  import { ADD_TASK, ADD_WRITER_TASK, DELETE_TASK_LANG, GET_WHITEBOARD } from '../../api/whiteboard'

  import type {
    NewsInfoSet,
    Task,
    TaskData,
    TaskDataLanguage,
    TaskLanguage,
    WriterData,
    WriterDataLanguage,
    Writer,
    DropResult,
    TasksStatusCount
  } from '../../types/whiteboard'

  import { ARTICLE_STATUS } from '@/utils/constants'
  import { getDateTime, joinName } from '@/utils/helpers'

  const router = useRouter()
  const { t } = useI18n()

  const tasks = ref<Task[]>([])
  const writers = ref<Writer[]>([])

  const LANG_ORDER = ['TKM', 'RUS', 'ENG'] as ['TKM', 'RUS', 'ENG']

  const showTask = ref(false)

  const openTask = () => {
    showTask.value = true
  }
  const closeTask = () => {
    showTask.value = false
  }

  const loadingTask = ref(false)
  const addTask = async (text: string) => {
    try {
      loadingTask.value = true
      await ADD_TASK({
        data: {
          name: text
        }
      })

      closeTask()
      getTasks()
    } catch (error) {
      console.error(error)
    } finally {
      loadingTask.value = false
    }
  }

  const getTasks = async (): Promise<void> => {
    try {
      const { data } = await GET_WHITEBOARD()

      tasks.value = data.news?.map((task: TaskData) => normalizeTaskData(task)) || []

      writers.value = data.writers?.map((writer: WriterData) => normalizeWriter(writer)) || []
    } catch (error) {
      console.error(error)
    }
  }
  getTasks()

  const normalizeTaskData = (task: TaskData): Task => {
    return {
      uuid: task.uuid,
      slug: task.slug,
      created_at: task.created_at,
      info: normalizeTaskDataMainInfo(task),
      langs: normalizeTaskDataLangs(task)
    }
  }

  const normalizeTaskDataLangs = (task: TaskData): TaskLanguage[] => {
    const visibilityStatuses = [
      ARTICLE_STATUS.EMPTY,
      ARTICLE_STATUS.WRITING,
      ARTICLE_STATUS.WAITING,
      ARTICLE_STATUS.PLANNING
    ]

    const taskFilteredVisibility = task.langs
      .sort((x, y) => LANG_ORDER.indexOf(x.lang_name) - LANG_ORDER.indexOf(y.lang_name))
      .filter((lang: TaskDataLanguage): boolean => visibilityStatuses.includes(lang.status))

    const taskLanguages = taskFilteredVisibility.map((lang: TaskDataLanguage): TaskLanguage => {
      const gaveInfo = []

      if (lang.writer && lang.gave_task && lang.gave_task_date) {
        gaveInfo.push({ key: 'gaveTask', value: joinName(lang.gave_task) })
        gaveInfo.push({ key: 'gaveTaskDate', value: getDateTime(lang.gave_task_date) })
      }

      const creatorInfo = [
        { key: 'creator', value: joinName(task.creator) },
        { key: 'createdDate', value: getDateTime(task.created_at) }
      ]

      return {
        uuid: lang.uuid,
        lang: lang.lang_name,
        slug: lang.slug,
        created_at: task.created_at,
        status: lang.status,
        info: [creatorInfo, gaveInfo]
      }
    })

    return taskLanguages
  }

  const normalizeTaskDataMainInfo = (task: TaskData): NewsInfoSet[] => {
    const langs = {
      TKM: 'Turkmen',
      RUS: 'Русский',
      ENG: 'English'
    }
    const langsInfo = task.langs.map((taskLang: TaskDataLanguage): NewsInfoSet => {
      const langInfo = [{ key: 'language', value: langs[taskLang.lang_name] }]

      if (taskLang.writer && taskLang.gave_task && taskLang.gave_task_date) {
        langInfo.push({ key: 'writer', value: joinName(taskLang.writer) })
        langInfo.push({ key: 'gaveTask', value: joinName(taskLang.gave_task) })
        langInfo.push({ key: 'gaveTaskDate', value: getDateTime(taskLang.gave_task_date) })
      }

      langInfo.push({ key: 'status', value: taskLang.status })

      return langInfo
    })

    return [
      [
        { key: 'creator', value: joinName(task.creator) },
        { key: 'createdDate', value: getDateTime(task.created_at) }
      ],
      ...langsInfo
    ]
  }

  const normalizeWriter = (writer: WriterData): Writer => {
    const tasks = writer.lang.map((langTask: WriterDataLanguage): TaskLanguage => {
      return {
        uuid: langTask.uuid,
        lang: langTask.lang_name,
        slug: langTask.slug,
        status: langTask.status,
        created_at: langTask.created_at,
        info: [
          [
            { key: 'creator', value: joinName(langTask.creator) },
            { key: 'createdDate', value: getDateTime(langTask.created_at) }
          ],
          [
            { key: 'gaveTask', value: joinName(langTask.gave_task) },
            { key: 'gaveTaskDate', value: getDateTime(langTask.gave_task_date) }
          ]
        ]
      }
    })

    return {
      employee: writer.writer,
      tasks: tasks
    }
  }

  const addWriterTask = async ({ writerIndex, task }: { writerIndex: number; task: TaskLanguage }): Promise<void> => {
    try {
      const writerTasks = writers.value[writerIndex].tasks
      const isNotWriterTask = !writerTasks.some((writerTask: TaskLanguage): boolean => writerTask.uuid === task.uuid)

      if (isNotWriterTask) {
        if (task.status !== ARTICLE_STATUS.EMPTY) {
          writers.value.findIndex((writer: Writer) => {
            writer.tasks = writer.tasks.filter((writerTask: TaskLanguage): boolean => writerTask.uuid !== task.uuid)
          })
        }

        task.status = ARTICLE_STATUS.WRITING
        writers.value[writerIndex].tasks.push(JSON.parse(JSON.stringify(task)))

        await ADD_WRITER_TASK({
          data: {
            lang_id: task.uuid,
            writer_id: writers.value[writerIndex].employee.uuid
          }
        })

        getTasks()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const deleteWriterTask = ({ writerIndex, task }: { writerIndex: number; task: TaskLanguage }) => {
    writers.value[writerIndex].tasks = writers.value[writerIndex].tasks.filter(
      (writerTask: TaskLanguage): boolean => writerTask.uuid !== task.uuid
    )
  }

  const showRemove = ref(false)
  const onRemoveDragEnter = () => {
    showRemove.value = true
  }
  const onRemoveDragLeave = () => {
    showRemove.value = false
  }

  const deleteTask = async (dropResult: DropResult) => {
    try {
      onRemoveDragLeave()

      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        await DELETE_TASK_LANG({ uuid: dropResult.payload.uuid })
        getTasks()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const openDeletedNews = () => {
    router.push('/articles/deleted')
  }

  const tasksStatusCount = computed((): TasksStatusCount => {
    const tasksStatusCount = {
      TKM: { EMPTY: 0, WRITING: 0, WAITING: 0 },
      RUS: { EMPTY: 0, WRITING: 0, WAITING: 0 },
      ENG: { EMPTY: 0, WRITING: 0, WAITING: 0 }
    } as TasksStatusCount

    tasks.value.forEach((task: Task): void => {
      task.langs.forEach((taskLang: TaskLanguage): void => {
        const lang = taskLang.lang
        const status = taskLang.status

        if (tasksStatusCount[lang] && tasksStatusCount[lang][status] !== undefined) {
          tasksStatusCount[lang][status]++
        }
      })
    })

    return tasksStatusCount
  })

  const computeHoursDifference = (dateString: string) => {
    const givenDate: any = new Date(dateString)
    const currentDate: any = new Date()
    const difference = currentDate - givenDate

    const hours = Math.floor(difference / (60 * 60 * 1000))

    return hours
  }

  const computeIsNew = (date: string) => {
    return computeHoursDifference(date) <= 24
  }
  const computeIsDanger = (date: string) => {
    return computeHoursDifference(date) >= 48
  }
</script>

<template>
  <div class="whiteboard">
    <div class="whiteboard__head">
      <working-environment-head></working-environment-head>
    </div>
    <div class="whiteboard__body">
      <div class="whiteboard__main">
        <div class="whiteboard__main-head">
          <div class="whiteboard__main-head-langs-articles-counts">
            <div v-for="lang in LANG_ORDER" class="lang-articles-count">
              <div class="lang-articles-count__lang">{{ lang }}</div>
              <div class="lang-articles-count__status">
                <p>{{ tasksStatusCount[lang].EMPTY }}</p>
              </div>
              <div class="lang-articles-count__status lang-articles-count__status_writing">
                <icon name="clock" />
                <p>{{ tasksStatusCount[lang].WRITING }}</p>
              </div>
              <div class="lang-articles-count__status lang-articles-count__status_waiting">
                <icon name="doneAll" />
                <p>{{ tasksStatusCount[lang].WAITING }}</p>
              </div>
            </div>
          </div>
          <div class="whiteboard__main-head-controllers">
            <Container
              @drop="deleteTask"
              behaviour="drop-zone"
              group-name="task"
              @drag-enter="onRemoveDragEnter"
              @drag-leave="onRemoveDragLeave"
              :class="['whiteboard__main-head-controller-delete', { _active: showRemove }]"
            >
              <button @click="openDeletedNews"><icon name="delete" /></button>
            </Container>
            <button @click="openTask" class="whiteboard__main-head-controller-add">
              <icon name="addCircle" />
            </button>
          </div>
        </div>
        <div class="whiteboard__main-white-list">
          <template v-for="task in tasks" :key="task.id">
            <whiteboard-task
              :task="task"
              :new="computeIsNew(task.created_at)"
              :danger="computeIsDanger(task.created_at)"
            />
          </template>
        </div>
      </div>
      <div class="whiteboard__writers">
        <div v-for="(writer, index) in writers" class="whiteboard__writer">
          <whiteboard-writer
            @add="(task) => addWriterTask({ writerIndex: index, task })"
            @delete="(task) => deleteWriterTask({ writerIndex: index, task })"
            :writer="writer.employee"
            :tasks="writer.tasks"
          />
        </div>
      </div>
    </div>
  </div>
  <teleport to="#pop-up">
    <pop-up-task v-if="showTask" @close="closeTask" @save="addTask" :loading="loadingTask" :title="t('addArticle')" />
  </teleport>
</template>

<style scoped lang="scss">
  .whiteboard {
    width: 900px;
    height: calc(100vh - 118px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    // .whiteboard__head
    &__head {
    }
    // .whiteboard__main-head
    &__main-head {
      display: flex;
      justify-content: space-between;
      padding: 9px;
      height: 48px;
    }
    // .whiteboard__main-head-langs-articles-counts
    &__main-head-langs-articles-counts {
      display: flex;
      gap: 10px;
    }
    // .whiteboard__main-head-controllers
    &__main-head-controllers {
      display: flex;
      gap: 4px;
    }
    // .whiteboard__main-head-controller-delete
    &__main-head-controller-delete {
      width: 200px;
      display: flex;
      justify-content: flex-end;
      margin-left: -170px;
      &._active {
      }
      button {
        border-radius: 4px;
        padding: 4px;
        border: 1px solid var(--dark);
        color: var(--dark);
        background-color: transparent;
        &:deep() {
          .icon {
            svg {
              width: 20px;
              height: 20px;
            }
          }
        }
      }
    }
    // .whiteboard__main-head-controller-add
    &__main-head-controller-add {
      border-radius: 4px;
      background: var(--accent);
      color: var(--white);
      padding: 5px;
      &:deep() {
        .icon {
          svg {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    // .whiteboard__main-white-list
    &__main-white-list {
    }

    // .whiteboard__body
    &__body {
      padding: 20px 0 20px 4px;
      flex: 1 1;
      display: flex;
      gap: 14px;
      height: 0;
    }
    // .whiteboard__main
    &__main {
      border-radius: var(--border-radius);
      border: 1px solid #f0f0f0;
      background: #f9f9f9;
      flex: 1 1;
      width: 0;
      height: 100%;
    }

    // .whiteboard__main-white-list
    &__main-white-list {
      height: calc(100% - 48px);
      padding: 14px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-right: 10px;
      overflow: overlay;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: var(--accent);
      }
    }

    // .whiteboard__writers
    &__writers {
      width: 270px;
      height: 100%;
      padding-right: 10px;
      overflow: overlay;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: var(--accent);
      }
    }
    // .whiteboard__writer
    &__writer {
      &:not(:first-child) {
        margin-top: 4px;
      }
    }
  }

  .lang-articles-count {
    display: flex;
    gap: 4px;
    // .lang-articles-count__lang
    &__lang {
      color: var(--dark);
      font-size: 14px;
      line-height: 20px;
      font-style: normal;
      font-weight: 700;
      padding: 5px 10px;
      align-items: center;
      border-radius: 4px;
      background: #e7e7e7;
      border: 1px solid #dedede;
    }
    // .lang-articles-count__status
    &__status {
      display: flex;
      align-items: center;
      border-radius: 4px;
      padding: 5px 2px;
      background: #eaeaea;
      border: 1px solid #dedede;
      gap: 4px;
      min-width: 30px;
      &:deep() {
        .icon {
          svg {
            width: 16px;
            height: 16px;
          }
        }
      }
      p {
        color: var(--text-primary, rgba(0, 0, 0, 0.87));
        font-size: 12px;
        line-height: 20px;
        font-style: normal;
        font-weight: 400;
        letter-spacing: 0.4px;
        text-align: center;
        width: 100%;
      }

      // .lang-articles-count__status_writing
      &_writing {
        background: #fff2ea;
      }
      // .lang-articles-count__status_planning
      &_planning {
        background: #effee8;
      }
      // .lang-articles-count__status_waiting
      &_waiting {
        background: #ebf6ff;
      }
    }
  }
</style>
