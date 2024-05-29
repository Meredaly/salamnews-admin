const Module = () => import('./Module.vue')

const Categories = () => import('./pages/Categories.vue')
const Stats = () => import('./pages/Stats.vue')
const Published = () => import('./pages/Published.vue')
const Pinned = () => import('./pages/Pinned.vue')
const Planned = () => import('./pages/workingEnvironment/Planned.vue')
const WorkingEnvironment = () => import('./pages/workingEnvironment/index.vue')
const Whiteboard = () => import('./pages/workingEnvironment/Whiteboard.vue')
const WaitList = () => import('./pages/workingEnvironment/WaitList.vue')
const Article = () => import('./pages/Article.vue')
const Deleted = () => import('./pages/Deleted.vue')
const Workplace = () => import('./pages/workplace/index.vue')
const WorkplaceDrafts = () => import('./pages/workplace/Drafts.vue')
const WorkplacePublished = () => import('./pages/workplace/Published.vue')

const moduleRoute = {
  path: '/news',
  component: Module,
  redirect: '/news/workplace',
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
      path: 'pinned',
      component: Pinned
    },
    {
      path: 'working-environment',
      component: WorkingEnvironment,
      redirect: '/news/working-environment/whiteboard',
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
      component: Workplace,
      redirect: '/news/workplace/drafts',
      children: [
        {
          path: 'drafts',
          component: WorkplaceDrafts
        },
        {
          path: 'published',
          component: WorkplacePublished
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
