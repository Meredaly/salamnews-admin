export interface Employee {
  uuid: string
  name: string
  surname: string
  login: string
  job_title: string
  path: string
  description: string
}

export interface EmployeeForm {
  name: string
  surname: string
  description: string
  login: string
  password: string
  job_title: string
  path: string
}
