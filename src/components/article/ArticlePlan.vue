<script setup lang="ts">
  import { ref, reactive, computed, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'
  import SButton from '@/UI/SButton.vue'

  const { t } = useI18n()

  const emit = defineEmits(['save', 'cancel'])

  const props = defineProps({
    date: { type: String, default: '' }
  })

  const selectedDate = reactive({
    day: 1,
    month: 0,
    year: 0
  })

  const currentDate = reactive({
    day: 0,
    month: 0,
    year: 0
  })

  const calendarStartDay = ref<number>(0)
  const daysPrevMonth = ref<number>(0)
  const daysCurrentMonth = ref<number>(0)
  const nextMonthDayCount = ref<number>(0)

  const monthNames = ref<string[]>([
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'oktober',
    'november',
    'december'
  ])
  const weekNames = ref<string[]>(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'sunday', 'saturday'])
  const yearNumbers = computed(() => {
    let arr = []
    for (let i = 2021; i <= 2100; i++) {
      arr.push(i)
    }
    return arr
  })

  const createCalendar = (year: number, month: number) => {
    const calendarMonth = new Date(year, month)

    selectedDate.year = year
    selectedDate.month = month

    calendarStartDay.value = calendarMonth.getDay() === 0 ? 7 : calendarMonth.getDay()

    let prevYear = year
    let prevMonth = month - 1
    if (prevMonth < 0) {
      prevMonth = 0
      prevYear = year - 1
    }

    daysPrevMonth.value = 32 - new Date(prevYear, prevMonth, 32).getDate()
    daysCurrentMonth.value = 32 - new Date(year, month, 32).getDate()
    nextMonthDayCount.value = 42 - calendarStartDay.value - daysCurrentMonth.value + 1
  }

  const selectYear = (year: number) => {
    selectedDate.year = year
    createCalendar(selectedDate.year, selectedDate.month)
    toggleYear()
  }

  const selectMonth = (month: number) => {
    selectedDate.month = month

    createCalendar(selectedDate.year, selectedDate.month)
    toggleMonth()
  }

  const selectDay = (day: number) => {
    selectedDate.day = day

    currentDate.year = selectedDate.year
    currentDate.month = selectedDate.month
    currentDate.day = selectedDate.day
  }

  const showMonth = ref(false)
  const toggleMonth = () => {
    showMonth.value = !showMonth.value
    showYear.value = false
  }

  const showYear = ref(false)
  const toggleYear = () => {
    showYear.value = !showYear.value
    showMonth.value = false
  }

  const updateDate = (date: string) => {
    let newDate = new Date(date || '')

    if (newDate.toString() === 'Invalid Date') {
      newDate = new Date()
    }

    selectedDate.day = newDate.getDate()
    selectedDate.month = newDate.getMonth()
    selectedDate.year = newDate.getFullYear()

    currentDate.day = newDate.getDate()
    currentDate.month = newDate.getMonth()
    currentDate.year = newDate.getFullYear()
  }

  const time = ref('')

  const cancel = () => {
    emit('cancel')
  }

  const save = () => {
    emit('save', {
      date: `${selectedDate.year.toString().padStart(4, '0')}-${(selectedDate.month + 1)
        .toString()
        .padStart(2, '0')}-${selectedDate.day.toString().padStart(2, '0')}`,
      time: time.value
    })
  }

  watch(
    () => props.date,
    (date) => {
      updateDate(date)
      createCalendar(selectedDate.year, selectedDate.month)
    }
  )

  updateDate(props.date)
  createCalendar(selectedDate.year, selectedDate.month)
</script>

<template>
  <div class="article-plan">
    <div class="article-plan__wrapper">
      <div class="article-plan__box">
        <div class="article-plan__header">{{ t('calendar') }}</div>
        <div class="article-plan__month-year">
          <div class="article-plan__dropdown">
            <div @click="toggleMonth" class="article-plan__dropdown-button">
              <p>{{ t(monthNames[selectedDate.month]) }}</p>
              <icon name="chevronDown" />
            </div>
            <div v-if="showMonth" class="article-plan__dropdown-body">
              <div
                v-for="index in 12"
                @click="selectMonth(index - 1)"
                :class="['article-plan__dropdown-item', { _active: selectedDate.month === index - 1 }]"
              >
                {{ t(monthNames[index - 1]) }}
              </div>
            </div>
          </div>
          <div class="article-plan__dropdown">
            <div @click="toggleYear" class="article-plan__dropdown-button">
              <p>{{ selectedDate.year }}</p>
              <icon name="chevronDown" />
            </div>
            <div v-show="showYear" class="article-plan__dropdown-body">
              <div
                v-for="yearNumber in yearNumbers"
                @click="selectYear(yearNumber)"
                :class="['article-plan__dropdown-item', { _active: selectedDate.year === yearNumber }]"
              >
                {{ yearNumber }}
              </div>
            </div>
          </div>
        </div>
        <div class="article-plan__calendar">
          <div class="calendar">
            <div class="calendar__body">
              <div class="calendar__weekdays">
                <div v-for="weekName in weekNames" class="calendar__weekday">{{ t(weekName) }}</div>
              </div>
              <div class="calendar__days">
                <template v-for="day in daysPrevMonth" :key="'other-' + day">
                  <div v-if="day >= daysPrevMonth - calendarStartDay + 2" class="calendar__day calendar__day-other">
                    <div class="calendar__day-text">{{ day }}</div>
                  </div>
                </template>
                <template v-for="day in daysCurrentMonth" :key="'current-' + day">
                  <div
                    @click="selectDay(day)"
                    :class="[
                      'calendar__day',
                      {
                        calendar__day_active:
                          selectedDate.year === currentDate.year &&
                          selectedDate.month === currentDate.month &&
                          day === selectedDate.day
                      }
                    ]"
                  >
                    <div class="calendar__day-box"></div>
                    <div class="calendar__day-text">{{ day }}</div>
                  </div>
                </template>
                <template v-for="day in nextMonthDayCount" :key="'other-' + day">
                  <div class="calendar__day calendar__day-other">
                    <div class="calendar__day-text">{{ day }}</div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="article-plan__time">
          <div class="article-plan__time-title">{{ t('time') }}</div>
          <input v-model="time" type="text" class="article-plan__timepicker" placeholder="00:00" />
        </div>
        <div class="article-plan__bot">
          <s-button @click="cancel" :title="t('cancel')" block styles="secondary" />
          <s-button @click="save" :title="t('save')" block />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .article-plan {
    position: fixed;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    // .article-plan__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    // .article-plan__box
    &__box {
      border-radius: 4px;
      background: var(--white);
      padding: 20px;
    }
    // .article-plan__header
    &__header {
      color: #000;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      text-align: center;
    }
    // .article-plan__month-year
    &__month-year {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
    // .article-plan__dropdown
    &__dropdown {
      position: relative;
      color: var(--text);
      margin-top: 10px;
    }
    // .article-plan__dropdown-button
    &__dropdown-button {
      border-radius: 4px;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      padding: 4px;
      gap: 10px;
      cursor: pointer;
      user-select: none;
    }
    // .article-plan__dropdown-body
    &__dropdown-body {
      position: absolute;
      top: calc(100% + 4px);
      background: #f5f5f5;
      z-index: 2;
      max-height: 200px;
      overflow: auto;
      width: 100%;
      padding: 4px;
    }
    // .article-plan__dropdown-item
    &__dropdown-item {
      border-radius: 4px;
      padding: 7px 4px;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      cursor: pointer;
      user-select: none;
      &._active,
      &:hover {
        background: #df2f2f;
        color: #f5f5f5;
      }
    }

    // .article-plan__calendar
    &__calendar {
    }
    // .article-plan__time
    &__time {
      border-radius: 4px;
      background: #f5f5f5;
      padding: 10px;
    }
    // .article-plan__time-title
    &__time-title {
      color: #000;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
      text-align: center;
    }
    // .article-plan__timepicker
    &__timepicker {
      border-radius: 4px;
      background: #ebebeb;
      text-align: center;
      width: 100%;
      margin-top: 10px;
      color: #000;
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
      padding: 4px;
    }
    // .article-plan__bot
    &__bot {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
  }

  .calendar {
    // .calendar__body
    &__body {
      position: relative;
    }
    // .calendar__weekdays
    &__weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
    // .calendar__weekday
    &__weekday {
      width: 30px;
      height: 30px;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      text-transform: uppercase;
      color: var(--caption);
      letter-spacing: 0.4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    // .calendar__days
    &__days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }
    // .calendar__day
    &__day {
      width: 30px;
      height: 30px;
      border-radius: 2px;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      overflow: hidden;
      color: var(--text);
      &:nth-child(7n) {
        border-right-color: transparent;
      }
      &:nth-last-child(1),
      &:nth-last-child(2),
      &:nth-last-child(3),
      &:nth-last-child(4),
      &:nth-last-child(5),
      &:nth-last-child(6),
      &:nth-last-child(7) {
        border-bottom-color: transparent;
      }
      &:hover,
      &_active {
        .calendar__day-box {
          background-color: var(--accent);
          color: var(--white);
        }
        .calendar__day-box + .calendar__day-text {
          color: var(--white);
        }
      }
    }
    // .calendar__day-other
    &__day-other {
      user-select: none;
      cursor: default;
      color: rgba(51, 51, 51, 0.4);
    }
    // .calendar__day-text
    &__day-text {
      font-weight: 500;
      font-size: 12px;
      line-height: 20px;
      position: relative;
      z-index: 1;
    }
    // .calendar__day-box
    &__day-box {
      position: absolute;
      z-index: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
