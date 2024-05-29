const Module = () => import('./Module.vue')

const Stats = () => import('./pages/Stats.vue')
const Photos = () => import('./pages/article/index.vue')
const PhotoDrafts = () => import('./pages/article/Drafts.vue')
const PhotoPublished = () => import('./pages/article/Published.vue')
const PhotoPlanned = () => import('./pages/article/Planned.vue')
const Editor = () => import('./pages/article/Editor.vue')

const moduleRoute = {
  path: '/horoscope',
  component: Module,
  redirect: '/horoscope/article',
  children: [
    {
      path: 'stats',
      component: Stats
    },
    {
      path: 'article',
      component: Photos,
      redirect: '/horoscope/article/drafts',
      children: [
        {
          path: 'drafts',
          component: PhotoDrafts
        },
        {
          path: 'published',
          component: PhotoPublished
        },
        {
          path: 'planned',
          component: PhotoPlanned
        },
        {
          path: 'edit/:id',
          component: Editor
        }
      ]
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
