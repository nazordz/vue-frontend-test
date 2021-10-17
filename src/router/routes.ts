import { RouteRecordRaw } from 'vue-router';

// function isAuthenticated(to: string, from: string) {
//   if (Object.prototype.hasOwnProperty.call(localStorage, 'token')) {
//     return true
//   }
// }

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('pages/Login.vue'),
    meta: {
      guest: true
    }
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'users', component: () => import('pages/User.vue') },
      { path: 'category-products', component: () => import('pages/CategoryProduct.vue') },
      { path: 'products', component: () => import('pages/Product.vue') },
      { path: 'transactions', component: () => import('pages/Transaction.vue') },
    ],
    meta: {
      requiresAuth: true
    }
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
