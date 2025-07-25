import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

import AuthLayout from '../layouts/AuthLayout.vue';
import UserLayout from '../layouts/UserLayout.vue';

import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Board from '../views/Boards.vue';
import Task from '../views/Tasks.vue';
import BoardDetails from '../views/BoardDetails.vue';
import ManageUsers from '../views/ManageUsers.vue';
import Profile from '../views/Profile.vue';

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },

  {
    path: '/',
    component: AuthLayout,
    meta: { guest: true },
    children: [
      { path: '/login', component: Login },
      { path: '/register', component: Register },
    ],
  },

  {
    path: '/',
    component: UserLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '/dashboard', component: Dashboard },
      { path: '/boards', component: Board },
      { path: '/tasks', component: Task },
      { path: '/board/:id', component: BoardDetails },
      { path: '/manage-users', component: ManageUsers, meta: { requiresAdmin: true } },
      { path: '/profile', component: Profile }
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.user) {
    return next('/login');
  }
  if (to.meta.guest && auth.user) {
    return next('/dashboard');
  }
  if (to.meta.requiresAdmin && (!auth.user || !auth.user.is_admin)) {
    return next('/dashboard');
  }
  next();
});

export default router;
