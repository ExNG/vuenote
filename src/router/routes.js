
export default [
  {
    path: '/',
    name: 'main',
    component: () => import('layouts/default')
  },

  {
    path: '/settings',
    name: 'settings',
    component: () => import('layouts/Settings')
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
