import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { loadLayoutMiddleware } from '@/router/middleware/loadLayout.middleware'
import { useCookies } from 'vue3-cookies'
import { useAuth } from '@/store/auth'

const routes: Array<RouteRecordRaw> = []

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(loadLayoutMiddleware)

router.beforeEach(async (to, from, next) => {
  to
  from

  const { cookies } = useCookies()
  const auth = useAuth()
  if (!auth.isAuth && cookies.get('Authorization')) {
    await auth.fetchUser()
  }

  if (to.path === '/authorization/login') {
    next()
    return
  }

  if (!auth.isAuth) {
    next('/authorization/login')
    return
  }

  next()
})

export default router
