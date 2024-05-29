const Module = () => import('./Module.vue')
const Home = () => import('./pages/Home.vue')

const moduleRoute = {
  path: '/',
  component: Module,
  redirect: '/news/workplace/drafts',
  children: [
    {
      path: '',
      redirect: '/news/workplace/drafts',
      component: Home
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
