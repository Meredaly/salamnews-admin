// interface NewsArticle {
//   // client tarapa gelmeli
//   id: number
//   lang: 'TM'
//   slug: string
//   title: string
//   description: string
//   tags: string
//   publish_date: Date
//   author: string
//   categories: Category[]
//   main_type: 'IMAGE' | 'VIDEO'
//   main_image: {
//     author: string
//     description: string
//     images: Image[]
//   }
//   main_video: {
//     id: number
//     video: string
//     duration: string
//     preloader: Image
//   }
//   other_languages: ['RU', 'EN']
//   view: number
//   like: number
//   bookmark: number

//   content: Content[]

//   // gosmaca bolmaly
//   created_at: Date
//   creator: Employee
//   gave_task: Employee
//   gave_task_date: Date
//   writer: Employee
//   note: String
//   status: 'PUBLISHED' | 'WRITING' | 'WAITING'
// }

// interface Employee {
//   id: number
//   name: string
// }

// interface Image {
//   id: number
//   author: string
//   image: string
// }

// interface Category {
//   id: number
//   slug: string
//   name: string
//   parent: Category | null
// }

// // content soray
// type Content {
//   type: 'IMAGE' | 'VIDEO' | 'TEXT'
// 	content: ContentImage | ContentVideo | ContentText
// }

// interface ContentImage {
//   id: number
//   image: string
// }

// interface ContentVideo {
//   id: number
//   preloader: string
//   cutting_status: boolean
//   video: string
//   duration: string
// }
// interface ContentText {
//   text: string
// }

// // text gaty uyly bolup bilyar

interface CreateNews {
  slug: string
}
interface NewsPaylananda {
  news_lang_id: string
  writer_id: string
}
interface News {
  id: string
  slug: string
  creator: {
    name: string
    surname: string
  }
  created_at: Date
  langs: [
    {
      id: string
      slug: string
      lang: 'TKM'
      status: 'EMPTY'
      writer: null
      gave_task: null
      gave_task_date: null
    },
    {
      id: string
      slug: string
      lang: 'RUS'
      status: 'WRITING'
      writer: {
        name: string
        surname: string
      }
      gave_task: {
        name: string
        surname: string
      }
      gave_task_date: '2023-09-10 12:00'
    }
  ]
}

interface writerNews {
  employee: {
    id: string
    name: string
    surname: string
  }
  news: [
    {
      id: string
      slug: string
      lang: 'RUS'
      status: 'WRITING'
      writer: {
        name: string
        surname: string
      }
      gave_task: {
        name: string
        surname: string
      }
      gave_task_date: '2023-09-10 12:00'
    },
    {
      id: string
      slug: string
      lang: 'RUS'
      status: 'WRITING'
      writer: {
        name: string
        surname: string
      }
      gave_task: {
        name: string
        surname: string
      }
      gave_task_date: '2023-09-10 12:00'
    }
  ]
}
