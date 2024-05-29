interface EmployeeName {
  name: string
  surname: string
}

export const joinName = (employee: EmployeeName): string => {
  return employee.name + ' ' + employee.surname
}
