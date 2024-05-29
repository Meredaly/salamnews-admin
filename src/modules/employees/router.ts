const Module = () => import('./Module.vue')

const Employees = () => import('./pages/Employees.vue')
const Employee = () => import('./pages/Employee.vue')
const Stats = () => import('./pages/Stats.vue')

const moduleRoute = {
  path: '/employees',
  component: Module,
  redirect: '/employees/list',
  children: [
    {
      path: 'list',
      component: Employees
    },
    {
      path: 'employee/:id',
      component: Employee
    },
    {
      path: 'stats',
      component: Stats
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
