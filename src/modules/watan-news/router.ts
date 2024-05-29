const Module = () => import('./Module.vue')

const Stats = () => import('./pages/Stats.vue')
const Videos = () => import('./pages/video/index.vue')
const VideoDrafts = () => import('./pages/video/Drafts.vue')
const VideoPublished = () => import('./pages/video/Published.vue')
const VideoPlanned = () => import('./pages/video/Planned.vue')
const VideoEditor = () => import('./pages/video/VideoEditor.vue')

const moduleRoute = {
  path: '/watan',
  component: Module,
  redirect: '/watan/video',
  children: [
    {
      path: 'stats',
      component: Stats
    },
    {
      path: 'video',
      component: Videos,
      redirect: '/watan/video/drafts',
      children: [
        {
          path: 'drafts',
          component: VideoDrafts
        },
        {
          path: 'published',
          component: VideoPublished
        },
        {
          path: 'planned',
          component: VideoPlanned
        },
        {
          path: 'edit/:id',
          component: VideoEditor
        }
      ]
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
