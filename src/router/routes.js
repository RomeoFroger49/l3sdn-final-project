import { AdminRoles } from 'src/api/user/adminRoles';

//meta : roles - array of minimum roles that can access the route
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/unauthorized',
        component: () => import('pages/UnauthorizedPage.vue')
      },
      {
        path: '/:catchAll(.*)*',
        name: 'ErrorNotFound',
        component: () => import('pages/ErrorNotFound.vue')
      },
      {
        path: '/users',
        component: () => import('pages/UsersPage.vue'),
        meta: { roles: [AdminRoles.MANAGER] }
      },
      {
        path: '/user/:id',
        component: () => import('pages/UserEditPage.vue'),
        meta: { roles: [AdminRoles.RH, AdminRoles.MANAGER] }
      },
      {
        path: '/user/add',
        component: () => import('pages/CreateUserPage.vue'),
        meta: { roles: [AdminRoles.MANAGER] }
      },
      {
        path: '/interview/:id',
        component: () => import('pages/InterviewPage.vue'),
        meta: { roles: [AdminRoles.USER] }
      },
      {
        path: '/interview',
        component: () => import('pages/InterviewAllPage.vue'),
        meta: { roles: [AdminRoles.MANAGER] }
      },
      {
        path: '/interview/add',
        component: () => import('pages/CreateInterviewPage.vue'),
        meta: { roles: [AdminRoles.MANAGER] }
      }
    ],

    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
    meta: { requiresAuth: false }
  }
];

export default routes;
