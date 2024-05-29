import { registerModules } from './router/register-modules'

import home from '@/modules/home'
import employees from '@/modules/employees'
import news from '@/modules/news'
import authorization from '@/modules/authorization'
import articles from '@/modules/articles'
import media from '@/modules/media'
import business from '@/modules/business'
import watanNews from '@/modules/watan-news'
import poster from '@/modules/poster'
import tenders from '@/modules/tenders'
import horoscope from '@/modules/horoscope'
import banners from '@/modules/banners'

registerModules({
  authorization: authorization,
  home: home,
  employees: employees,
  news: news,
  articles: articles,
  media: media,
  business: business,
  watanNews: watanNews,
  poster: poster,
  tenders: tenders,
  horoscope: horoscope,
  banners: banners
})
