import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/leads',
    },
    {
      path: '/leads',
      name: 'leads',
      component: () => import('@/pages/LeadsListPage.vue'),
    },
    {
      path: '/leads/:id',
      name: 'lead-detail',
      component: () => import('@/pages/LeadDetailsPage.vue'),
    },
  ],
})

export default router
