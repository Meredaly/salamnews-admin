const Module = () => import('./Module.vue')

const Categories = () => import('./pages/Categories.vue')
const Stats = () => import('./pages/Stats.vue')
const Published = () => import('./pages/Published.vue')
const Deleted = () => import('./pages/Deleted.vue')
const Article = () => import('./pages/Article.vue')

const WorkingEnvironment = () => import('./pages/workingEnvironment/index.vue')
const Whiteboard = () => import('./pages/workingEnvironment/Whiteboard.vue')
const WaitList = () => import('./pages/workingEnvironment/WaitList.vue')
const Planned = () => import('./pages/workingEnvironment/Planned.vue')

const WorkPlace = () => import('./pages/workplace/index.vue')
const WorkPlaceDrafts = () => import('./pages/workplace/Drafts.vue')
const WorkPlacePublished = () => import('./pages/workplace/Published.vue')

const moduleRoute = {
  path: '/articles',
  component: Module,
  redirect: '/articles/workplace',
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
      path: 'published',
      component: Published
    },
    {
      path: 'working-environment',
      component: WorkingEnvironment,
      redirect: '/articles/working-environment/whiteboard',
      children: [
        {
          path: 'whiteboard',
          component: Whiteboard
        },
        {
          path: 'wait-list',
          component: WaitList
        },
        {
          path: 'planned',
          component: Planned
        }
      ]
    },
    {
      path: 'article/:article',
      component: Article
    },
    {
      path: 'workplace',
      component: WorkPlace,
      redirect: '/articles/workplace/drafts',
      children: [
        {
          path: 'drafts',
          component: WorkPlaceDrafts
        },
        {
          path: 'published',
          component: WorkPlacePublished
        }
      ]
    },
    {
      path: 'deleted',
      component: Deleted
    }
  ]
}

export default (router: any) => {
  router.addRoute(moduleRoute)
}
