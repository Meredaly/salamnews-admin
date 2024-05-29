const Module = () => import('./Module.vue')

const Stats = () => import('./pages/Stats.vue')
const BannerBlock = () => import('./pages/BannerBlock.vue')
const Editor = () => import('./pages/Editor.vue')

const moduleRoute = {
  path: '/banners',
  component: Module,
  redirect: '/banners/banner',
  children: [
    {
      path: 'banner',
      component: BannerBlock
    },
    {
      path: 'edit/:id',
      component: Editor
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
