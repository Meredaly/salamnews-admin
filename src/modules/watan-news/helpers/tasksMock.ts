const infoMain = [
  [
    { key: 'Doredilen wagty:', value: '12.08.2023 . 23:10' },
    { key: 'Doreden:', value: 'Sahedow Cary' }
  ],
  [
    { key: 'Dil:', value: 'Turkmen' },
    { key: 'Yazyjy:', value: 'Sahedow Cary' },
    { key: 'Is beren:', value: 'Sahedow Cary' },
    { key: 'Berlen wagty:', value: '12.08.2023 . 23:10' }
  ],
  [
    { key: 'Dil:', value: 'Russian' },
    { key: 'Yazyjy:', value: 'Sahedow Cary' },
    { key: 'Is beren:', value: 'Sahedow Cary' },
    { key: 'Berlen wagty:', value: '12.08.2023 . 23:10' }
  ]
]

const infoLang = [
  [
    { key: 'Doredilen wagty:', value: '12.08.2023 . 23:10' },
    { key: 'Doreden:', value: 'Sahedow Cary' }
  ],
  [
    { key: 'Yazyjy:', value: 'Sahedow Cary' },
    { key: 'Is beren:', value: 'Sahedow Cary' },
    { key: 'Berlen wagty:', value: '12.08.2023 . 23:10' }
  ]
]

const mockTasks = [
  {
    id: 1,
    slug: 'turkmenskie-hudozhniki-otpravyatsya-v-azerbajdzhan-44ca9e',
    info: infoMain,
    created_at: '2023-09-08T09:51:21.253Z',
    langs: [
      {
        id: 1,
        lang: 'TKM',
        slug: 'turkmenskie-hudozhniki-otpravyatsya-v-azerbajdzhan-44ca9e',
        status: 'WAITING',
        info: infoLang
      },
      {
        id: 2,
        lang: 'RUS',
        slug: 'turkmenskie-hudozhniki-otpravyatsya-v-azerbajdzhan-44ca9e',
        status: 'WRITING',
        info: infoLang
      }
    ]
  },
  {
    id: 2,
    slug: 'turkmenistanyn-dasary-sowda-duzguni-barada-ahtnamanyn-ii-klasterini-tayyarlamak-boyunca-isler-baslandy',
    info: infoMain,
    created_at: '2023-09-05T09:51:21.253Z',
    langs: [
      {
        id: 1,
        lang: 'TKM',
        slug: 'turkmenistanyn-dasary-sowda-duzguni-barada-ahtnamanyn-ii-klasterini-tayyarlamak-boyunca-isler-baslandy',
        status: 'EMPTY',
        info: infoLang
      },
      {
        id: 2,
        lang: 'RUS',
        slug: 'turkmenistanyn-dasary-sowda-duzguni-barada-ahtnamanyn-ii-klasterini-tayyarlamak-boyunca-isler-baslandy',
        status: 'WRITING',
        info: infoLang
      }
    ]
  },
  {
    id: 2,
    slug: 'hisense-predstavila-televizor-kartinu-v-kozhanoj-ramke',
    info: infoMain,
    created_at: '2023-09-05T09:51:21.253Z',
    langs: [
      {
        id: 1,
        lang: 'TKM',
        slug: 'hisense-predstavila-televizor-kartinu-v-kozhanoj-ramke',
        status: 'WAITING',
        info: infoLang
      },
      {
        id: 2,
        lang: 'RUS',
        slug: 'hisense-predstavila-televizor-kartinu-v-kozhanoj-ramke',
        status: 'EMPTY',
        info: infoLang
      }
    ]
  }
]

const mockWriterTasks = [
  {
    id: 1,
    lang: 'TKM',
    slug: 'su-gun-cempionlar-ligasynyn-toparcalaryny-bijeleri-cekiler',
    status: 'WAITING',
    info: [
      [
        { key: 'Doredilen wagty:', value: '12.08.2023 . 23:10' },
        { key: 'Doreden:', value: 'Sahedow Cary' }
      ],
      [
        { key: 'Yazyjy:', value: 'Sahedow Cary' },
        { key: 'Is beren:', value: 'Sahedow Cary' },
        { key: 'Berlen wagty:', value: '12.08.2023 . 23:10' }
      ]
    ]
  },
  {
    id: 2,
    lang: 'RUS',
    slug: 'su-gun-cempionlar-ligasynyn-toparcalaryny-bijeleri-cekiler',
    status: 'WRITING',
    info: [
      [
        { key: 'Doredilen wagty:', value: '12.08.2023 . 23:10' },
        { key: 'Doreden:', value: 'Sahedow Cary' }
      ],
      [
        { key: 'Yazyjy:', value: 'Sahedow Cary' },
        { key: 'Is beren:', value: 'Sahedow Cary' },
        { key: 'Berlen wagty:', value: '12.08.2023 . 23:10' }
      ]
    ]
  },
  {
    id: 3,
    lang: 'TKM',
    slug: 'su-gun-cempionlar-ligasynyn-toparcalaryny-bijeleri-cekiler',
    status: 'WRITING',
    info: [
      [
        { key: 'Doredilen wagty:', value: '12.08.2023 . 23:10' },
        { key: 'Doreden:', value: 'Sahedow Cary' }
      ],
      [
        { key: 'Yazyjy:', value: 'Sahedow Cary' },
        { key: 'Is beren:', value: 'Sahedow Cary' },
        { key: 'Berlen wagty:', value: '12.08.2023 . 23:10' }
      ]
    ]
  }
]
export { mockTasks, mockWriterTasks }
