const Module = () => import('./Module.vue')
const Login = () => import('./pages/Login.vue')

import { LayoutsEnum } from '@/layouts/layouts.types'

const moduleRoute = {
  path: '/authorization',
  component: Module,
  redirect: { path: '/authorization/login' },
  meta: {
    layout: LayoutsEnum.empty
  },
  children: [
    {
      path: 'login',
      component: Login
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
