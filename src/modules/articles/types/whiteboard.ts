export interface TaskData {
  uuid: string
  slug: string
  creator: {
    name: string
    surname: string
  }
  created_at: string
  langs: TaskDataLanguage[]
}

export interface EmployeeName {
  name: string
  surname: string
}

export interface TaskDataLanguage {
  uuid: string
  slug: string
  lang_name: 'TKM' | 'RUS' | 'ENG'
  status: string
  writer: EmployeeName | null
  gave_task: EmployeeName | null
  gave_task_date?: string
}

export interface WriterDataLanguage extends TaskDataLanguage {
  created_at: string
  creator: EmployeeName
  gave_task: EmployeeName
  gave_task_date: string
}

export interface Employee {
  uuid: string
  name: string
  surname: string
  job_title: string
  path: string
}

export interface WriterData {
  writer: Employee
  lang: WriterDataLanguage[]
}

export interface NewsInfoItem {
  key: string
  value: string
}

export type NewsInfoSet = NewsInfoItem[]

export interface TaskLanguage {
  uuid: string
  lang: 'TKM' | 'RUS' | 'ENG'
  slug: string
  status: string
  created_at: string
  info: NewsInfoSet[]
}

export interface Task {
  uuid: string
  slug: string
  created_at: string
  info: NewsInfoSet[]
  langs: TaskLanguage[]
}

export interface Writer {
  employee: Employee
  tasks: TaskLanguage[]
}

export interface DropResult {
  removedIndex: null | number
  addedIndex: null | number
  payload: TaskLanguage
}

interface LanguageTasksCount {
  [state: string]: number
}

export interface TasksStatusCount {
  TKM: LanguageTasksCount
  RUS: LanguageTasksCount
  ENG: LanguageTasksCount
}

export interface TasksCount {
  writing: number
  waiting: number
}
