const Module = () => import('./Module.vue')

const Categories = () => import('./pages/Categories.vue')
const Stats = () => import('./pages/Stats.vue')

const PhotoReport = () => import('./pages/photoReport/index.vue')
const PhotoReportDrafts = () => import('./pages/photoReport/Drafts.vue')
const PhotoReportPublished = () => import('./pages/photoReport/Published.vue')
const PhotoReportPlanned = () => import('./pages/photoReport/Planned.vue')
const PhotoReportElement = () => import('./pages/photoReport/PhotoReportElement.vue')

const VideoReport = () => import('./pages/videoReport/index.vue')
const VideoReportDrafts = () => import('./pages/videoReport/Drafts.vue')
const VideoReportPublished = () => import('./pages/videoReport/Published.vue')
const VideoReportPlanned = () => import('./pages/videoReport/Planned.vue')
const VideoReportElement = () => import('./pages/videoReport/VideoReportElement.vue')

const Shorts = () => import('./pages/shorts/index.vue')
const ShortElement = () => import('./pages/shorts/ShortElement.vue')
const ShortsDrafts = () => import('./pages/shorts/Drafts.vue')
const ShortsPlanned = () => import('./pages/shorts/Planning.vue')
const ShortsPublished = () => import('./pages/shorts/Published.vue')

const moduleRoute = {
  path: '/media',
  component: Module,
  redirect: '/media/photo-report',
  children: [
    {
      path: 'categories',
      component: Categories
    },
    {
      path: 'stats',
      component: Stats
    },
    {
      path: 'photo-report',
      component: PhotoReport,
      redirect: '/media/photo-report/drafts',
      children: [
        {
          path: 'drafts',
          component: PhotoReportDrafts
        },
        {
          path: 'published',
          component: PhotoReportPublished
        },

        {
          path: 'planned',
          component: PhotoReportPlanned
        },
        {
          path: 'element/:id',
          component: PhotoReportElement
        }
      ]
    },
    {
      path: 'video-report',
      component: VideoReport,
      redirect: '/media/video-report/drafts',
      children: [
        {
          path: 'drafts',
          component: VideoReportDrafts
        },
        {
          path: 'published',
          component: VideoReportPublished
        },
        {
          path: 'planned',
          component: VideoReportPlanned
        },
        {
          path: 'edit/:id',
          component: VideoReportElement
        }
      ]
    },
    {
      path: 'shorts',
      component: Shorts,
      redirect: '/media/shorts/drafts',
      children: [
        {
          path: 'drafts',
          component: ShortsDrafts
        },
        {
          path: 'published',
          component: ShortsPublished
        },
        {
          path: 'planned',
          component: ShortsPlanned
        },
        {
          path: 'edit/:id',
          component: ShortElement
        }
      ]
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
